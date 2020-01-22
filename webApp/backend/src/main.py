import logging
import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from typing import Tuple

# Need to setup the logger before importing any of our code. Otherwise, it won't
# have the custom logging configuration.
LOGGING_FORMAT = "[%(levelname)s] (%(asctime)s) %(name)s (%(lineno)s) - %(message)s"
logging.basicConfig(format=LOGGING_FORMAT, level=logging.INFO)

from controllers.api.api_controller import api_controller  # noqa


# Add the root path of the project's folder so that deeply nested
# files and folders can access the top-level files and folders (like utils)
# without needing a ridiculous number of relative imports.
sys.path.append(os.path.dirname(__file__))


def create_app() -> Flask:
    """
    Create the Flask app and disable caring about whether or not a route ends with /
    Also disable a deprecation warning: https://github.com/pallets/flask/issues/2549
    """
    app = Flask(__name__)
    app.url_map.strict_slashes = False
    app.config["JSONIFY_PRETTYPRINT_REGULAR"] = False
    CORS(app, resources={r"/api/*": {"origins": ["*"]}})

    return app


app = create_app()

# Register the base API controller that funnels out application logic
# to all of the sub controllers for all the rub routes.
app.register_blueprint(api_controller)


@app.errorhandler(500)
def server_error(exception: Exception) -> Tuple[str, int]:
    """Handle any exceptions that get through the sub controllers."""
    logging.exception("An error occurred during a request.")
    return jsonify({"status": "error", "message": str(exception)}), 500


if __name__ == "__main__":
    # This is used when running locally.
    app.run(host="0.0.0.0", port=5000, debug=True)
