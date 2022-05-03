from daos import consts
from daos.sql import Sql
from presenters.query_builder import QueryBuilder


class SearchEngine:
    def __init__(self):
        self._sql = Sql()
        self._query_builder = QueryBuilder()

    def search(self, body, role):
        query = self._query_builder.build_query_by_body(body, role)
        print(query)
        results = self._sql.query_with_columns(query)
        return results
