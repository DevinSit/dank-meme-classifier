from utils.NestableBlueprint import NestableBlueprint
from .v1.v1_controller import v1_controller

api_controller = NestableBlueprint("api", __name__, url_prefix="/api")
api_controller.register_blueprint(v1_controller)
