from flask_restful import Resource
from flask import request
from presenters.search import SearchEngine
from presenters.union_user_data import union_user_data
from resources.wrappers import try_get_resource


class Search(Resource):

    @try_get_resource
    def post(self, user_type):
        body = request.json
        search_engine = SearchEngine()
        results = search_engine.search(body, user_type)
        union_data = union_user_data(results)
        return {"results": union_data}