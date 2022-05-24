from flask_restful import Resource, ResponseBase
from models.exceptions import DBError


def try_get_resource(func):
    def inner(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except (DBError, Exception) as e:
            return ResponseBase(str(e), 503)
    return inner
