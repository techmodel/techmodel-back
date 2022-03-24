class SqlQueries:
    def __init__(self, sql):
        self.sql = sql

    def get_many_table_name(self, filter_name):
        query = f"select table_name from filter_to_table where filter='{filter_name}'"
        result = self.sql.run_query_with_results(query)[0]
        return str(result[0])
