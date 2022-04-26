import consts
from daos.db import SQLDao
from queries_consts import ENUM_SELECT_QUERY, USER_TYPE_TABLE


class SqlQueries:
    def __init__(self):
        self.sql = SQLDao(server_name=consts.SQL_SERVER, db_name=consts.SQL_DB, user_name=consts.SQL_USERNAME,
                           password=consts.SQL_PASSWORD, driver=consts.SQL_DRIVER)

    def get_many_table_name(self, filter_name):
        query = f"select table_name from filter_to_table where filter='{filter_name}'"
        result = self.sql.run_query_with_results(query)[0]
        return str(result[0])

    def get_types(self, table_name):
        query = ENUM_SELECT_QUERY.format(table=table_name)
        results = self.sql.run_query_with_results(query)[0]
        return [result[1] for result in results]
