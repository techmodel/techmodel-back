from flask_restful import Resource, ResponseBase
from flask import request, make_response
from models.exceptions import DBError
from presenters.search import SearchEngine
from presenters.union_user_data import union_user_data


class Search(Resource):

    def post(self, user_type):
        try:
            body = request.json
            search_engine = SearchEngine()
            results = search_engine.search(body, user_type)
            union_data = union_user_data(results)
            return {"results": union_data}
        except DBError as e:
            return ResponseBase(str(e), 503)


# get optional filters for search by user_type
class SearchParams(Resource):
    def get(self, user_type):
        pass
