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


class Profile(Resource):

    @try_get_resource
    @authenticate
    def get(self, user_type):
        user_info = get_user_info_from_token(request.cookies.get("token"))

        enum_columns = {}
        enum_columns.update(GENERIC_USER_ENUM_COLUMNS)
        enum_columns.update(USER_TYPE_TO_ENUMS[user_type])
        queries = QueryBuilder().get_all_data_by_user(user_info.id, GENERIC_USER_NON_ENUM_COLUMNS + USER_TYPE_TO_ALL_COLUMNS[
            user_type], enum_columns)
        results = {}
        for query in queries:
            results.update(*Sql().query_with_columns(query))
        return results

    def post(self, user_type):
        pass

    def put(self, user_type):
        pass


class LogIn(Resource):
    def post(self):
        user_id = request.json.get('userId')
        query = QueryBuilder().get_all_data_by_user(user_id, ["id", "user_type"], {})[0]
        result = Sql().query_with_columns(query)
        if not result:
            return "user does not exist", 401
        result = result[0]
        result["exp"] = datetime.now() + timedelta(hours=JWT_NUM_HOURS_FOR_COOKIE)
        token = jwt.encode(result, JWT_SECRET, JWT_ALGORITHM)
        response = make_response()
        response.set_cookie('token', token)
        return response


class LogOut(Resource):
    def get(self):
        response = make_response()
        response.delete_cookie('token')
        return response
