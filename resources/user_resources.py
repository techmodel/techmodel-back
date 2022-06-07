from collections import defaultdict
from flask_restful import Resource
from datetime import datetime, timedelta
from flask import request, make_response
import jwt

from queries_consts import *
from query_builder.query_builder import QueryBuilder
from db_connection.sql import Sql
from resources.wrappers import try_get_resource, authenticate
from authentication.authentication import get_user_info_from_token
from authentication.consts import JWT_SECRET, JWT_ALGORITHM, JWT_NUM_HOURS_FOR_COOKIE


def join_rows(rows):
    complete_data = defaultdict(list)
    for row in rows:
        for key, value in row.items():
            complete_data[key].append(value)

    formatted_complete_data = {}
    for key, value in complete_data.items():
        value = set(value)
        if len(value) == 1:
            value = value.pop()
            if value is not None:
                formatted_complete_data[key] = value
        else:
            formatted_complete_data[key] = list(value)
    return formatted_complete_data


def get_all_data_by_user(user_id):
    query = QueryBuilder().get_all_data_by_user(user_id)
    user_data = Sql().query_with_columns(query)
    return join_rows(user_data)


class Profile(Resource):

    @try_get_resource
    @authenticate
    def get(self, user_type):
        user_info = get_user_info_from_token(request.cookies.get("token"))
        get_all_data_by_user(user_info.id)

    def post(self, user_type):
        pass

    def put(self, user_type):
        pass


class LogIn(Resource):
    def post(self):
        user_id = request.json.get('userId')
        user_data = get_all_data_by_user(user_id)
        if not user_data:
            return {"userDetails": None, "isFound": False, "userToken": None, "userType": None}

        token_data = {"user_type": user_data["user_type"], "user_id": user_data["user_id"]}
        token_data["exp"] = datetime.now() + timedelta(hours=JWT_NUM_HOURS_FOR_COOKIE)
        token = jwt.encode(token_data, JWT_SECRET, JWT_ALGORITHM)

        return {"userDetails": user_data, "isFound": True, "userToken": token, "userType": user_data["user_type"]}


class LogOut(Resource):
    def get(self):
        response = make_response()
        response.delete_cookie('token')
        return response
