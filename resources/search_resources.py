from flask_restful import Resource


class Search(Resource):
    def get(self, search_object):
        pass

    def post(self, search_object):
        pass


# get optional filters for search by user_type
class SearchParams(Resource):
    def get(self, user_type):
        pass
