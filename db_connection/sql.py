from .db import DB
from . import consts


class Sql:
    def __init__(self):
        self._connection = DB(server_name=consts.SQL_SERVER, db_name=consts.SQL_DB, user_name=consts.SQL_USERNAME,
                              password=consts.SQL_PASSWORD, driver=consts.SQL_DRIVER)

    def query_with_columns(self, query, should_zip=True):
        results, columns = self._connection.run_query_with_results(query)

        if not should_zip:
            return results, columns

        zipped_results = []
        for result in results:
            zipped_results.append(dict(zip(columns, result)))
        return zipped_results

    def query(self, query):
        result = self._connection.run_query_with_results(query)[0]
        if len(result) == 0:
            return None
        return result
