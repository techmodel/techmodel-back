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
        queries = QueryBuilder().get_all_data_by_user(user_info.id, user_type)
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
        query = QueryBuilder().get_data_by_user(user_id, ["id", "user_type"], {})[0]
        user_data = Sql().query_with_columns(query)
        if not user_data:
            return {"userDetails": None, "isFound": False, "userToken": None, "userTypeId": None}
        user_data = user_data[0]
        user_data["exp"] = datetime.now() + timedelta(hours=JWT_NUM_HOURS_FOR_COOKIE)
        token = jwt.encode(user_data, JWT_SECRET, JWT_ALGORITHM)

        queries = QueryBuilder().get_all_data_by_user(user_id, INT_TO_ROLE[user_data["user_type"]])
        results = {}
        for query in queries:
            results.update(*Sql().query_with_columns(query))
        return {"userDetails": results, "isFound": True, "userToken": token, "userTypeId": user_data["user_type"]}


class LogOut(Resource):
    def get(self):
        response = make_response()
        response.delete_cookie('token')
        return response
