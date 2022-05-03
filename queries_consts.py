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


USERS_TABLE = "users"

VOLUNTEER = "volunteer"
MANAGER = "manager"

GENERIC_USER_NON_ENUM_COLUMNS = ["first_name", "last_name", "email", "phone"]
GENERIC_USER_ENUM_COLUMNS = {"gender_id": "genders", "user_type": "user_types"}
GENERIC_USER_ALL_COLUMNS = GENERIC_USER_NON_ENUM_COLUMNS + list(GENERIC_USER_ENUM_COLUMNS.keys())

VOLUNTEER_ENUM_COLUMNS = {}
MANAGER_ENUM_COLUMNS = {}

VOLUNTEER_ALL_COLUMNS = [] + list(VOLUNTEER_ENUM_COLUMNS.keys())
MANAGER_ALL_COLUMNS = [] + list(MANAGER_ENUM_COLUMNS.keys())

USER_TYPE_TO_ENUMS = {VOLUNTEER: VOLUNTEER_ENUM_COLUMNS, MANAGER: MANAGER_ENUM_COLUMNS}
USER_TYPE_TO_ALL_COLUMNS = {VOLUNTEER: VOLUNTEER_ALL_COLUMNS, MANAGER: MANAGER_ALL_COLUMNS}

SELECT_COLUMNS_BY_ID = """SELECT {columns} FROM {table} WHERE id = {id}"""

SELECT_ENUM_COLUMN_BY_ID = """SELECT [name] as {column} from {enum_table}_enum as enum left join users on enum.id = users.{column} where users.id = {id}"""