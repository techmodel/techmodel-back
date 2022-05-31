from flask_restful import Resource, ResponseBase

from db_connection.sql import Sql
from query_builder.query_builder import QueryBuilder
from queries_consts import PARAM_NAMES_TO_TABLES, USER_TYPE_TO_PROFILE_PARAMS
from resources.wrappers import try_get_resource, authenticate


class Types(Resource):
    def __init__(self):
        self.query_builder = QueryBuilder()
        self.sql_querier = Sql()

    @try_get_resource
    @authenticate
    def get(self, param_name):
        query = self.query_builder.get_types(PARAM_NAMES_TO_TABLES[param_name])
        result = self.sql_querier.query(query)
        result = [{item[0]: item[1]} for item in result]
        return result


class ProfileParams(Resource):
    def __init__(self):
        self.type_querier = Types()

    @try_get_resource
    @authenticate
    def get(self, user_type):
        all_params = {}
        if user_type not in USER_TYPE_TO_PROFILE_PARAMS:
            return ResponseBase("Unknown user type", 500)

        for readable_name in PARAM_NAMES_TO_TABLES.keys():
            if readable_name in USER_TYPE_TO_PROFILE_PARAMS[user_type]:
                all_params[readable_name] = self.type_querier.get(readable_name)
        return all_params
