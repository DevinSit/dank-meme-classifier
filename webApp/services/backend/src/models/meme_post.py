import json
import os
import logging
from cachetools import cached, TTLCache
from google.cloud import datastore, pubsub_v1, storage
from typing import BinaryIO, List, Tuple
from werkzeug.utils import secure_filename
from config import IMAGE_SIZE, IMAGES_STORAGE_BUCKET, PREDICTIONS_TOPIC
from utils.blockhash import hash_image


logger = logging.getLogger(__name__)
post_cache = TTLCache(maxsize=10, ttl=1800)
score_cache = TTLCache(maxsize=100, ttl=1800)
predictions_cache = TTLCache(maxsize=200, ttl=3600)

POST_KIND = "RedditPost"
KERAS_PREDICTION_KIND = "DankKerasPrediction"
AUTOML_PREDICTION_KIND = "DankAutoMLPrediction"
POST_SCORE_KIND = "RedditPostScore"


class MemePost:
    def __init__(self):
        # Disabled for demo purposes
        # self.datastore_client = datastore.Client()
        # self.publisher_client = pubsub_v1.PublisherClient()
        # self.storage_client = storage.Client()
        pass

    def get_latest_posts(self, number_of_posts=10):
        posts = self._fetch_latest_posts(number_of_posts)

        for post in posts:
            score_entity = self._get_score(post["id"])
            post["score"] = score_entity["score"]

        return posts

    def increment_score(self, post_id: str) -> int:
        score_entity = self._get_score(post_id)
        score_entity["score"] += 1

        self.datastore_client.put(score_entity)
        score_cache[post_id] = score_entity

        return score_entity["score"]

    def process_image(self, request_file: BinaryIO):
        destination = os.path.join("/tmp", secure_filename(request_file.filename))
        request_file.save(destination)

        image_hash = hash_image(destination, "{0}x{0}".format(IMAGE_SIZE))

        # Image has already been processed recently; no need to process it again
        if image_hash in predictions_cache:
            return image_hash

        hash_filename = image_hash + ".jpg"
        hash_source = os.path.join("/tmp", hash_filename)

        bucket = self.storage_client.get_bucket(IMAGES_STORAGE_BUCKET)
        blob = bucket.blob(hash_filename)

        blob.upload_from_filename(hash_source)
        os.remove(destination)
        os.remove(hash_source)

        message = json.dumps([{"imageHash": image_hash}]).encode("utf-8")
        self.publisher_client.publish(PREDICTIONS_TOPIC, message)

        return image_hash

    def get_prediction(self, image_hash: str) -> Tuple[float, float]:
        if image_hash in predictions_cache and predictions_cache[image_hash]:
            return predictions_cache[image_hash]

        keras_key = self.datastore_client.key(KERAS_PREDICTION_KIND, image_hash)
        automl_key = self.datastore_client.key(AUTOML_PREDICTION_KIND, image_hash)

        keras_prediction = self.datastore_client.get(keras_key)
        automl_prediction = self.datastore_client.get(automl_key)

        if keras_prediction and automl_prediction:
            predictions = (keras_prediction["prediction"], automl_prediction["prediction"])
            predictions_cache[image_hash] = predictions

            return predictions
        else:
            return None

    @cached(score_cache)
    def _get_score(self, post_id: str) -> datastore.Entity:
        key = self.datastore_client.key(POST_SCORE_KIND, post_id)
        score_entity = self.datastore_client.get(key)

        if not score_entity:
            score_entity = datastore.Entity(key=key)
            score_entity["id"] = post_id
            score_entity["score"] = 0
            self.datastore_client.put(score_entity)

        return score_entity

    @cached(post_cache)
    def _fetch_latest_posts(self, number_of_posts=10) -> List[datastore.Entity]:
        query = self.datastore_client.query(kind=POST_KIND, order=["-createdUtc"])
        posts = self._sort_by_image_hash(list(query.fetch(limit=number_of_posts)))

        keras_keys = [self.datastore_client.key(KERAS_PREDICTION_KIND, post["imageHash"]) for post in posts]
        automl_keys = [self.datastore_client.key(AUTOML_PREDICTION_KIND, post["imageHash"]) for post in posts]

        # Because datastore_client.get_multi() doesn't return Entities in the same order as the given keys,
        # we have to sort everything by image hash. This way also fixes an issue with using a dict indexed
        # by image hash where only one post of multiple with the same hash (e.g. the "Image not found" hash)
        # would get predictions.
        keras_predictions = self._sort_by_image_hash(self.datastore_client.get_multi(keras_keys))
        automl_predictions = self._sort_by_image_hash(self.datastore_client.get_multi(automl_keys))

        for post, keras_prediction, automl_prediction in zip(posts, keras_predictions, automl_predictions):
            post["kerasPrediction"] = keras_prediction["prediction"]
            post["autoMLPrediction"] = automl_prediction["prediction"]

        return sorted(posts, key=lambda post: post["createdUtc"], reverse=True)

    def _sort_by_image_hash(self, object_list):
        return sorted(object_list, key=lambda x: x["imageHash"])
