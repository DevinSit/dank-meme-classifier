from threading import Lock
from flask import Blueprint


# Idea borrowed from 'teozkr' at https://github.com/pallets/flask/issues/593
class NestableBlueprint(Blueprint):
    """
    A light wrapper around Flask's Blueprint that enables nesting
    blueprints so that you chain Blueprints together as composable
    and independent views.
    """

    def register_blueprint(self, blueprint: Blueprint, **options) -> None:
        """
        Registers a blueprint onto this blueprint just like how you might register a
        blueprint on the Flask app with 'app.register_blueprint'. This is what enables
        chaining a series of NestableBlueprints together to form independent views.

        Args:
            blueprint:  Either a regular Blueprint or NestableBlueprint to chain onto the current NestableBlueprint
            options:    Dict of options that would normally get passed to 'app.register_blueprint'.
        """

        def deferred(state):
            url_prefix = (state.url_prefix or u"") + (options.get('url_prefix', blueprint.url_prefix) or u"")
            if 'url_prefix' in options:
                del options['url_prefix']

            state.app.register_blueprint(blueprint, url_prefix=url_prefix, **options)

        self.record(deferred)

    def before_first_blueprint_request(self) -> "function":
        """
        A decorator that runs a function the first time any routes in a Blueprint
        gets called. Mimics 'before_app_first_request' but at the Blueprint level.
        """

        self._before_request_lock = Lock()
        self._got_first_request = False

        def decorator(function_being_decorated: "function") -> "function":
            @self.before_request
            def wrapper():
                if self._got_first_request:
                    return

                with self._before_request_lock:
                    if self._got_first_request:
                        return
                    self._got_first_request = True

                    function_being_decorated()

            return wrapper

        return decorator

    def reset_first_request_lock(self) -> None:
        """
        Resets the first request lock used by before_first_blueprint_request to determine
        whether or not the first request function has already been run. Used in test cases
        to ensure the first request function still fires between test case runs.
        """
        self._got_first_request = False
