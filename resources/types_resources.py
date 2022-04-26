from flask_restful import Resource
from daos.sql import SqlQueries
from queries_consts import USER_TYPE_TABLE, LANGUAGE_TYPE_TABLE, EVENT_FOCUS_TABLE, GENDER_TABLE


class UserTypes(Resource):
    def __init__(self):
        self.sql_querier = SqlQueries()

    # returns all users types from db
    def get(self):
        return self.sql_querier.get_types(USER_TYPE_TABLE)


class LanguageTypes(Resource):
    def __init__(self):
        self.sql_querier = SqlQueries()

    def get(self):
        return self.sql_querier.get_types(LANGUAGE_TYPE_TABLE)


class EventFocusTypes(Resource):
    def __init__(self):
        self.sql_querier = SqlQueries()

    def get(self):
        return self.sql_querier.get_types(EVENT_FOCUS_TABLE)

class GendersTypes(Resource):
    def __init__(self):
        self.sql_querier = SqlQueries()

    def get(self):
        return self.sql_querier.get_types(GENDER_TABLE)
