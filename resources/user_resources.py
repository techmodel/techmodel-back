from flask_restful import Resource, ResponseBase

from queries_consts import *
from presenters.query_builder import QueryBuilder
from daos.sql import Sql
from flask import request, make_response
import jwt
import os
from resources.wrappers import try_get_resource


# get/post/update user profile by user_type
# user_id in headers
class Profile(Resource):

    @try_get_resource
    def get(self, user_type):
        user_id = request.cookies.get("user_id")
        if not user_id:
            return ResponseBase("log in to view this page", 401)

        enum_columns = {}
        enum_columns.update(GENERIC_USER_ENUM_COLUMNS)
        enum_columns.update(USER_TYPE_TO_ENUMS[user_type])
        queries = QueryBuilder().get_all_data_by_user(user_id, GENERIC_USER_NON_ENUM_COLUMNS + USER_TYPE_TO_ALL_COLUMNS[user_type], enum_columns)
        results = {}
        for query in queries:
            results.update(*Sql().query_with_columns(query))
        return results

    def post(self, user_type):
        pass

    def put(self, user_type):
        pass


class LogIn(Resource):
    @staticmethod
    def _get_user_id_from_auth_token(auth_token):
        # TODO: actually integrate with google

        return auth_token, "manager"

    def post(self):
        user_id = request.json.get('userId')
        result = Sql().query_with_columns(f"SELECT * FROM USERS WHERE id='{user_id}'")
        keys, values = result[1], list(result[0][0])
        dictionary = dict(zip(keys, values))
        token = jwt.encode(dictionary, os.getenv("JWT_SECRET"))
        print(token)
        response = make_response()
        response.set_cookie('user_id', str(user_id))
        query = QueryBuilder().get_all_data_by_user(user_id, )
        result = Sql().query(query)
        #
        # if not result:
        #     return "user does not exist", 401
        return response


class LogOut(Resource):
    def get(self):
        response = make_response()
        response.delete_cookie('user_id')
        return response
