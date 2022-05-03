from models.enums import FilterType
from presenters.consts import FILTERS_QUERY
from queries_consts import *


class QueryBuilder:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(QueryBuilder, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def build_query_by_filters(self, filters, role):
        conditions = ""
        for filter in filters:
            filter_name = filter["filter_name"]
            conditions += f" AND {filter_name}"
            field_type = filter["field_type"]
            if field_type == FilterType.SINGLE.value:
                conditions += " = '{}'".format(filter["value"])
            elif field_type == FilterType.MULTIPLE.value:
                with_appo_list = [f"\'{x}\'" for x in filter["value"]]
                conditions += " IN ({})".format(
                    ",".join(with_appo_list)
                )
        return FILTERS_QUERY.format(conditions=conditions, user_type=role)

    def build_query_by_body(self, body, role):
        filters = body["filters"]
        return self.build_query_by_filters(filters, role)

    def _prettify_list(self, list):
        return ", ".join(list)

    def get_all_data_by_user(self, user_id, columns, enum_columns):
        queries = [GENERIC_USER_SELECT_QUERY.format(columns=self._prettify_list(columns),
                                                        table=USERS_TABLE, id=user_id)]
        for column, enum_table in enum_columns.items():
            queries.append(SELECT_ENUM_COLUMN.format(id=user_id, enum_table=enum_table, column=column))
        return queries
