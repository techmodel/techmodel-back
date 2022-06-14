"""SELECT id, [name] FROM {};"""

USER_TYPE_TABLE = "user_types_enum"
LANGUAGE_TYPE_TABLE = "languages_enum"
EVENT_FOCUS_TABLE = "event_focus_enum"
GENDER_TABLE = "genders_enum"
GEO_AREAS_TABLE = "geo_areas_enum"
POPULATION_TABLE = "population_types_enum"
COMPANIES_TABLE = "company_names_enum"
ROLES_TABLE = "company_roles_enum"
SCHOOLS_TABLE = "schools"
SCHOOL_TYPES_TABLE = "school_types_enum"
STUDENT_AMOUNTS_TABLE = "student_amount_enum"

USERS_TABLE = "dbo.users_info"

VOLUNTEER = "volunteer"
MANAGER = "manager"

INT_TO_ROLE = {2: VOLUNTEER, 1: MANAGER}

VOLUNTEER_PROFILE_PARAMS = ["genders", "geo_areas", "languages", "companies", "company_positions", "population_type",
                            "lecture_type"]
MANAGER_PROFILE_PARAMS = ["genders", "geo_areas", "school_types", "schools", "students_amount"]
USER_TYPE_TO_PROFILE_PARAMS = {VOLUNTEER: VOLUNTEER_PROFILE_PARAMS, MANAGER: MANAGER_PROFILE_PARAMS}

PARAM_NAMES_TO_TABLES = {"genders": GENDER_TABLE, "languages": LANGUAGE_TYPE_TABLE, "event_focuses": EVENT_FOCUS_TABLE,
                       "users": USER_TYPE_TABLE, "geo_areas": GEO_AREAS_TABLE, "population": POPULATION_TABLE,
                       "companies": COMPANIES_TABLE, "company_roles": ROLES_TABLE, "schools": SCHOOLS_TABLE,
                       "school_types": SCHOOL_TYPES_TABLE, "student_amounts": STUDENT_AMOUNTS_TABLE}

SELECT_COLUMNS_BY_ID = """SELECT {columns} FROM {table} WHERE user_id = '{id}'"""
SELECT_ALL_COLUMNS_BY_ID = """SELECT * FROM {table} WHERE user_id = '{id}'"""

SELECT_ENUM_COLUMN_BY_ID = """SELECT [name] as {column} from {enum_table}_enum as enum left join users on enum.id = users.{column} where users.id = '{id}'"""
