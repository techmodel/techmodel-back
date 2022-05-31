from flask_restful import Resource
from flask import request

from db_connection.sql import Sql
from query_builder.query_builder import QueryBuilder
from data_manipulations.union_data import union_user_data
from resources.wrappers import try_get_resource, authenticate


class Search(Resource):

    @try_get_resource
    @authenticate
    def post(self, user_type):
        body = request.json
        query = QueryBuilder().build_query_by_body(body, user_type)
        results = Sql().query_with_columns(query)
        union_data = union_user_data(results)
        return {"results": union_data}
