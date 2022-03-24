from flask_restful import Resource


class Search(Resource):
    def post(self, user_type):
        pass


# get optional filters for search by user_type
class SearchParams(Resource):
    def get(self, user_type):
        pass
