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


# DEMO: Disabled for demo purposes
#
# @predictions_controller.route(URL_PREFIX, methods=["POST"])
# @LoggingUtils.log_execution_time("Prediction processing finished")
# def get_predictions() -> Response:
#     data = request.get_json()
#     logger.info("Request data: " + str(data))
#
#     if "posts" not in data:
#         logger.warning("Posts are missing from payload.")
#         return jsonify(abort(400))
#
#     predictions = list(map(lambda post: keras_prediction.get_prediction(post["imageHash"]), data["posts"]))
#
#     return jsonify({
#         "status": "success",
#         "predictions": predictions
#     })


@predictions_controller.route("{}/file".format(URL_PREFIX), methods=["POST"])
@LoggingUtils.log_execution_time("Direct file prediction processing finished")
def get_file_prediction() -> Response:
    if "file" not in request.files:
        return jsonify({
            "status": "error",
            "message": "'file' is not present in the given files."
        }), 400

    prediction = keras_prediction.get_file_prediction(request.files["file"])

    return jsonify({
        "status": "success",
        "prediction": prediction
    })


@predictions_controller.errorhandler(Exception)
def error(exception):
    logging.exception("An error occurred during a request.")
    return jsonify({"status": "error", "message": "An error occurred; see logs."}), 500
