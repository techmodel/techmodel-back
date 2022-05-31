from flask_restful import ResponseBase
from db_connection.exceptions import DBError

from authentication.authentication import verify_user


def authenticate(func):
    def inner(*args, **kwargs):
        if verify_user():
            return func(*args, **kwargs)
        else:
            return ResponseBase("log in to view this page", 401)
    return inner


def try_get_resource(func):
    def inner(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except (DBError, Exception) as e:
            return ResponseBase(str(e), 503)
    return inner
