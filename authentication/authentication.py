import flask
import jwt
import os

from authentication.consts import UserInfo


def get_user_info_from_token(token):
    token_data = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
    return UserInfo(token_data["id"], token_data["user_type"])


def verify_user():
    try:
        user = get_user_info_from_token(flask.request.cookies["token"])
        return bool(user)
    except:
        return False
