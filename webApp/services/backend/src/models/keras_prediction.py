import cv2
import logging
import keras  # noqa
import numpy as np
import os
import tensorflow as tf
import time
from config import IMAGE_SIZE, IMAGES_STORAGE_BUCKET, MODEL_FILE
from google.cloud import storage
from keras.models import load_model


logger = logging.getLogger(__name__)

MODEL = None  # type: keras.Sequential
GRAPH = None  # type: tf.Graph


class KerasPrediction:
    def __init__(self):
        self.storage_client = storage.Client()
        self.bucket = self.storage_client.get_bucket(IMAGES_STORAGE_BUCKET)

    @staticmethod
    def init():
        global MODEL
        global GRAPH

        MODEL = load_model(MODEL_FILE)
        GRAPH = tf.get_default_graph()

        logger.info("Loaded model!")

    def get_prediction(self, image_hash: str) -> float:
        if not image_hash:
            return -1.0

        if MODEL is None or GRAPH is None:
            KerasPrediction.init()

        filename = self._download_image(image_hash)
        image = self._preprocess_image(filename)

        with GRAPH.as_default():
            logger.info("Waiting for prediction to complete...")
            start = time.time()

            prediction = np.asscalar(MODEL.predict(image)[0][0])

            elapsed = time.time() - start
            logger.info("Took {}s".format(elapsed))
            logger.info("Prediction: {}".format(prediction))

        os.remove(filename)
        return prediction

    def _download_image(self, image_hash: str) -> str:
        filename = image_hash + ".jpg"
        destination = os.path.join("/tmp", filename)

        blob = self.bucket.blob(filename)
        blob.download_to_filename(destination)

        return destination

    def _preprocess_image(self, filename: str) -> np.ndarray:
        image = cv2.imread(filename)
        resized_image = cv2.resize(image, (IMAGE_SIZE, IMAGE_SIZE))
        np_image = np.reshape(resized_image, [1, IMAGE_SIZE, IMAGE_SIZE, 3])

        return np_image
