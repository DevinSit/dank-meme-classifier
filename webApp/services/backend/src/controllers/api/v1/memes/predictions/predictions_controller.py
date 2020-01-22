import logging
from flask import abort, jsonify, request, Response
from models import KerasPrediction
from utils import LoggingUtils
from utils.NestableBlueprint import NestableBlueprint


URL_PREFIX = "/predictions"

logger = logging.getLogger(__name__)
predictions_controller = NestableBlueprint("predictions", __name__)

KerasPrediction.init()
keras_prediction = KerasPrediction()


@predictions_controller.route(URL_PREFIX, methods=["POST"])
@LoggingUtils.log_execution_time("Prediction processing finished")
def get_predictions() -> Response:
    data = request.get_json()
    logger.info("Request data: " + str(data))

    if "posts" not in data:
        logger.warning("Posts are missing from payload.")
        return jsonify(abort(400))

    predictions = list(map(lambda post: keras_prediction.get_prediction(post["imageHash"]), data["posts"]))

    return jsonify({
        "status": "success",
        "predictions": predictions
    })


@predictions_controller.errorhandler(Exception)
def error(exception):
    logging.exception("An error occurred during a request.")
    return jsonify({"status": "error", "message": "An error occurred; see logs."}), 500
