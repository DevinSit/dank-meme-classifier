import logging
from flask import jsonify, request, Response
from models import MemePost
from utils import LoggingUtils
from utils.NestableBlueprint import NestableBlueprint
from .predictions.predictions_controller import predictions_controller


logger = logging.getLogger(__name__)

memes_controller = NestableBlueprint("memes", __name__, url_prefix="/memes")
memes_controller.register_blueprint(predictions_controller)

meme_post_service = MemePost()


# DEMO: Disabled for demo purposes
#
# @memes_controller.route("/", methods=["GET"])
# @LoggingUtils.log_execution_time("Prediction processing finished")
# def get_latest_posts() -> Response:
#     posts = meme_post_service.get_latest_posts()
#
#     return jsonify({
#         "status": "success",
#         "posts": posts
#     })
#
#
# @memes_controller.route("/<post_id>/score", methods=["POST"])
# @LoggingUtils.log_execution_time("Score update finished")
# def increment_post_score(post_id: str) -> Response:
#     updated_score = meme_post_service.increment_score(post_id)
#
#     return jsonify({
#         "status": "success",
#         "updated_score": updated_score
#     })
#
#
# @memes_controller.route("/image", methods=["POST"])
# @LoggingUtils.log_execution_time("Image upload finished")
# def post_image() -> Response:
#     if "file" not in request.files:
#         return jsonify({
#             "status": "error",
#             "message": "'file' is not present in the given files."
#         }), 400
#
#     image_hash = meme_post_service.process_image(request.files["file"])
#
#     return jsonify({
#         "status": "success",
#         "imageHash": image_hash
#     })
#
#
# @memes_controller.route("/image/<image_hash>/predictions", methods=["GET"])
# @LoggingUtils.log_execution_time("Image predictions fetch")
# def get_image_predictions(image_hash: str) -> Response:
#     results = meme_post_service.get_prediction(image_hash)
#
#     if not results:
#         return jsonify({
#             "status": "pending",
#             "message": "Predictions are still being processed."
#         })
#     else:
#         keras_prediction, automl_prediction = results
#
#         return jsonify({
#             "status": "success",
#             "predictions": {
#                 "kerasPrediction": keras_prediction,
#                 "autoMLPrediction": automl_prediction
#             }
#         })
