import logging
from typing import List
from models import KerasPrediction


logger = logging.getLogger(__name__)


def dank_predictions_task(image_hashes: List[str]) -> List[float]:
    keras_prediction = KerasPrediction()
    predictions = list(map(lambda image_hash: keras_prediction.get_prediction(image_hash), image_hashes))

    return predictions
