from daos.sql import SqlQueries
from models.select_choise_enum import FilterType
from presenters.consts import FILTERS_QUERY


class QueryBuilder:
    def __init__(self, sql_conn):
        self.sql_querier = SqlQueries(sql_conn)

    def generate_query_by_filters(self, filters, role):
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
        sql_query = self.generate_query_by_filters(filters, role)
        return sql_query