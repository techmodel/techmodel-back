import consts
from daos.db import SQLDao
from presenters.query_builder import QueryBuilder


class SearchEngine:
    def __init__(self):
        self.sql = SQLDao(server_name=consts.SQL_SERVER, db_name=consts.SQL_DB, user_name=consts.SQL_USERNAME,
                          password=consts.SQL_PASSWORD, driver=consts.SQL_DRIVER)

    def search(self, body, role):
        query_builder = QueryBuilder(self.sql)
        query = query_builder.build_query_by_body(body, role)
        print(query)
        results, columns = self.sql.run_query_with_results(query)
        all_results = []
        for result in results:
            dict_results = dict(zip(columns, result))
            all_results.append(dict_results)
        return all_results
