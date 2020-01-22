import cv2
import logging
import keras  # noqa: Need keras present for the model to load, even if keras isn't used directly
import numpy as np
import os
import tensorflow as tf
import time
from config import IMAGE_SIZE, IMAGES_STORAGE_BUCKET, MODEL_FILE
from google.cloud import storage
from keras.models import load_model
from typing import BinaryIO
from werkzeug.utils import secure_filename


logger = logging.getLogger(__name__)

MODEL = None  # type: keras.Sequential
GRAPH = None  # type: tf.Graph


class KerasPrediction:
    def __init__(self):
        # Disabled for demo purposes
        # self.storage_client = storage.Client()
        # self.bucket = self.storage_client.get_bucket(IMAGES_STORAGE_BUCKET)
        pass

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

        filename = self._download_image(image_hash)
        return self._perform_prediction(filename)

    def get_file_prediction(self, image_file: BinaryIO) -> float:
        if not image_file:
            return -1.0

        filename = os.path.join("/tmp", secure_filename(image_file.filename))
        image_file.save(filename)

        return self._perform_prediction(filename)

    def _perform_prediction(self, filename: str) -> float:
        if MODEL is None or GRAPH is None:
            KerasPrediction.init()

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
