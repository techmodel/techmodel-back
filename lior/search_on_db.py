FILTER_TO_MANY_TABLE = {
    "language": "users_language",
    "population_type": "users_population"
}

FILTER_TO_ENUM_TABLE = {
    "language": "languages_enum",
    "population_type": "population_types_enum"
}

QUERY = """
    SELECT *
    FROM users
    INNER JOIN user_types_enum
        ON user_types_enum.id = users.user_type
    {more_filters}
    WHERE user_types_enum.name = '{user_type}' 
    {more_where}
"""

INNER_JOIN_FORMAT = """
    INNER JOIN {many_table}
        ON {many_table}.user_id = users.id
    INNER JOIN {enum_table}
        ON {enum_table}.id = {many_table}.{filter}_id

"""


def generate_query_by_filters(filters, role):
    more_filters = ""
    more_where = ""
    for filter in filters:
        more_where += " AND "
        filter_name = filter["filter_name"]
        many_table = FILTER_TO_MANY_TABLE[filter_name]
        enum_table = FILTER_TO_ENUM_TABLE[filter_name]
        more_filters += INNER_JOIN_FORMAT.format(many_table=many_table,
                                                 enum_table=enum_table,
                                                 filter=filter_name)
        more_where += f"{enum_table}.name"
        if filter["field_type"] == "single":
            more_where += " = '{}'".format(filter["value"])
        elif filter["field_type"] == "multiple":
            with_appo_list = [f"\'{x}\'" for x in filter["value"]]
            more_where += " IN ({})".format(
                ",".join(with_appo_list)
            )
        else:
            print("BAD filter field type")
    return QUERY.format(more_filters=more_filters, more_where=more_where, user_type=role)

def search_filters(body):
    filters = body["filters"]
    role = body["role"]
    sql_query = generate_query_by_filters(filters, role)
    return sql_query