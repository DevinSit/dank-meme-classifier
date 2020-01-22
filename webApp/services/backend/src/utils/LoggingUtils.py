import logging
from functools import wraps
from time import time
from typing import Callable

logger = logging.getLogger(__name__)


def log_execution_time(log_message: str) -> Callable:
    """
    A decorator that is used for measuring how long a function takes
    to execute and then logs the execution time to the logger.

    Args:
        log_message: The portion of the log message that appears before the execution time.

    Examples of log messages:
        input: log_message = "Loaded model"
        output: "Loaded model in 5.3s."
    """

    def decorator(function_being_decorated: Callable) -> Callable:
        @wraps(function_being_decorated)
        def wrapper(*args, **kwargs):
            start_time = time()

            result = function_being_decorated(*args, **kwargs)

            elapsed_time = "%.4f" % (time() - start_time)
            logger.info("{} in {}s.".format(log_message, elapsed_time))

            return result

        return wrapper

    return decorator
