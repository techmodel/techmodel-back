from queries_consts import *


def prettify_list(list):
    return ", ".join(list)


def get_all_data_by_user(user_id, columns, enum_columns):
    queries = []
    queries.append(GENERIC_USER_SELECT_QUERY.format(columns=prettify_list(columns),
                                                    table=USERS_TABLE, id=user_id))
    for column, enum_table in enum_columns.items():
        queries.append(ENUM_SELECT_QUERY.format(id=user_id, table=enum_table))
    return queries