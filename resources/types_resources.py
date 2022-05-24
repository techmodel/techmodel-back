from flask_restful import Resource, ResponseBase

from daos.sql import Sql
from queries_consts import USER_TYPE_TABLE, LANGUAGE_TYPE_TABLE, EVENT_FOCUS_TABLE, GENDER_TABLE, GEO_AREAS_TABLE, \
    POPULATION_TABLE, COMPANIES_TABLE, ROLES_TABLE, VOLUNTEER, MANAGER, \
    STUDENT_AMOUNTS_TABLE, SCHOOLS_TABLE, SCHOOL_TYPES_TABLE
from resources.wrappers import try_get_resource


class UserTypes(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    # returns all users types from db
    @try_get_resource
    def get(self):
        return self.sql_querier.get_types(USER_TYPE_TABLE)


class LanguageTypes(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    @try_get_resource
    def get(self):
        return self.sql_querier.get_types(LANGUAGE_TYPE_TABLE)


class EventFocusTypes(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    @try_get_resource
    def get(self):
        return self.sql_querier.get_types(EVENT_FOCUS_TABLE)


class GendersTypes(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    @try_get_resource
    def get(self):
        return self.sql_querier.get_types(GENDER_TABLE)


class GeoAreaTypes(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    @try_get_resource
    def get(self):
        return self.sql_querier.get_types(GEO_AREAS_TABLE)


class PopulationTypes(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    @try_get_resource
    def get(self):
        return self.sql_querier.get_types(POPULATION_TABLE)


class Companies(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    @try_get_resource
    def get(self):
        return self.sql_querier.get_types(COMPANIES_TABLE)


class CompanyRoles(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    @try_get_resource
    def get(self):
        return self.sql_querier.get_types(ROLES_TABLE)


class Schools(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    @try_get_resource
    def get(self):
        return self.sql_querier.get_types(SCHOOLS_TABLE)


class SchoolTypes(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    @try_get_resource
    def get(self):
        return self.sql_querier.get_types(SCHOOL_TYPES_TABLE)


class StudentAmounts(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    @try_get_resource
    def get(self):
        return self.sql_querier.get_types(STUDENT_AMOUNTS_TABLE)


class ProfileParams(Resource):
    def __init__(self):
        self.sql_querier = Sql()

    @try_get_resource
    def get(self, user_type):
        if user_type == VOLUNTEER:
            return {"genders": GendersTypes().get(),
                    "geo_areas": GeoAreaTypes().get(),
                    "languages": LanguageTypes().get(),
                    "companies": Companies().get(),
                    "company_positions": CompanyRoles().get(),
                    "population_type": PopulationTypes().get(),
                    "lecture_type": EventFocusTypes().get()}
        elif user_type == MANAGER:
            return {"genders": GendersTypes().get(),
                    "geo_areas": GeoAreaTypes().get(),
                    "school_types": SchoolTypes().get(),
                    "schools": Schools().get(),
                    "students_amount": StudentAmounts().get()}

        return ResponseBase("Unknown user type", 500)
