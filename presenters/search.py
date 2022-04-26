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
        results, columns = self._sql.query_with_columns(query)
        all_results = []
        for result in results:
            dict_results = dict(zip(columns, result))
            all_results.append(dict_results)
        return all_results
