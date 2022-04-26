from flask_restful import Resource

from daos.sql import SqlQueries
from queries_consts import *
from query_builder import *
from presenters.search import SearchEngine
from flask import request, make_response


class UserTypes(Resource):
    def __init__(self):
        self.sql_querier = SqlQueries()

    # returns all users types from db
    def get(self):
        return self.sql_querier.get_user_types()


class ProfileParams(Resource):
    # return profile params by user_type
    def get(self, user_type):
        all_data = {}
        all_enums = GENERIC_USER_ENUM_COLUMNS
        all_enums.update(USER_TYPE_TO_ENUMS[user_type])

        for key, value in all_enums:
            query = ENUM_SELECT_QUERY.format(USER_TYPE_TABLE)
            all_data[key] = query
        return all_data


# get/post/update user profile by user_type
# user_id in headers
class Profile(Resource):
    def get(self, user_id, user_type):
        queries = []
        queries += get_all_data_by_user(user_id, GENERIC_USER_NON_ENUM_COLUMNS, GENERIC_USER_ENUM_COLUMNS)
        queries += get_all_data_by_user(user_id, USER_TYPE_TO_ALL_COLUMNS[user_type], USER_TYPE_TO_ENUMS[user_type])
        return queries

    def post(self, user_type):
        pass

    def put(self, user_type):
        pass


class LogIn(Resource):
    @staticmethod
    def _get_user_id_from_auth_token(auth_token):
        # TODO: actually integrate with google
        return auth_token, 1

    def post(self):
        auth_token = request.json.get('auth_token')
        user_id, user_role = self._get_user_id_from_auth_token(auth_token)
        if not user_id:
            return "no user in the auth token", 401
        search_engine = SearchEngine()
        result = search_engine.search(
            {"filters": [{"filter_name": "user_id", "field_type": "single", "value": user_id}]}, user_role)
        if not result:
            return "user does not exist", 401
        response = make_response()
        response.set_cookie('user_id', str(user_id), secure=True)
        return response


class LogOut(Resource):
    def get(self):
        response = make_response()
        response.delete_cookie('user_id')
        return response
