from flask_restful import Resource, ResponseBase
from flask import request
from presenters.search import SearchEngine
from presenters.union_user_data import union_user_data
from resources.wrappers import try_get_resource


class Search(Resource):

    @try_get_resource
    def post(self, user_type):
        try:
            body = request.json
            search_engine = SearchEngine()
            results = search_engine.search(body, user_type)
            union_data = union_user_data(results)
            print({"results": union_data})
            return {"results": union_data}
        except (DBError, Exception) as e:
            return ResponseBase(str(e), 503)
