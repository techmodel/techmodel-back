from flask_restful import Resource
from queries_consts import *
from query_builder import *
from flask import request, make_response


class UserTypes(Resource):
    # returns all users types from db
    def get(self):
        query = ENUM_SELECT_QUERY.format(USER_TYPE_TABLE)
        return query


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
    def post(self):
        user_id = request.json.get('user_id')
        if not user_id:
            return 401
        response = make_response()
        response.set_cookie('user_id', )
        return response


class LogOut(Resource):
    def get(self):
        pass
