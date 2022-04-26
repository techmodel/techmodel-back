from flask_restful import Resource
from daos.sql import Sql
from queries_consts import USER_TYPE_TABLE, LANGUAGE_TYPE_TABLE, EVENT_FOCUS_TABLE, GENDER_TABLE, GEO_AREAS_TABLE, \
    POPULATION_TABLE


class UserTypes(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    # returns all users types from db
    def get(self):
        return self.sql_querier.get_types(USER_TYPE_TABLE)


class LanguageTypes(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    def get(self):
        return self.sql_querier.get_types(LANGUAGE_TYPE_TABLE)


class EventFocusTypes(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    def get(self):
        return self.sql_querier.get_types(EVENT_FOCUS_TABLE)


class GendersTypes(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    def get(self):
        return self.sql_querier.get_types(GENDER_TABLE)


class GeoAreaTypes(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    def get(self):
        return self.sql_querier.get_types(GEO_AREAS_TABLE)


class PopulationTypes(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    def get(self):
        return self.sql_querier.get_types(POPULATION_TABLE)
