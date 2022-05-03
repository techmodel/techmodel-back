from flask_restful import Resource

from queries_consts import *
from presenters.query_builder import QueryBuilder
from daos.sql import Sql
from flask import request, make_response
from resources.wrappers import try_get_resource


"""
    This doesn't work
    It uses bad queries, incorrect and bad data,
    and the frontend doesnt need it

  
class ProfileParams(Resource):
    # return profile params by user_type
    @try_get_resource
    def get(self, user_type):
        all_data = {}
        all_enums = GENERIC_USER_ENUM_COLUMNS
        all_enums.update(USER_TYPE_TO_ENUMS[user_type])

        for key, value in all_enums.items():
            query = SELECT_ENUM_PARAM.format(enum_table=USER_TYPE_TABLE)
            all_data[key] = query
        return all_data
"""


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
        auth_token = request.json.get('auth_token')
        user_id, user_role = self._get_user_id_from_auth_token(auth_token)
        if not user_id:
            return "no user in the auth token", 401
        query = QueryBuilder().build_query_by_filters(
            [{"filter_name": "user_id", "field_type": "single", "value": user_id}], user_role)
        result = Sql().query(query)

        if not result:
            return "user does not exist", 401
        response = make_response()
        response.set_cookie('user_id', str(user_id))
        return response


class LogOut(Resource):
    def get(self):
        response = make_response()
        response.delete_cookie('user_id')
        return response
