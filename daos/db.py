import pyodbc
import consts


class SQLDao:
    def __init__(self, server_name, db_name, user_name, password, driver):
        self.server_name = server_name
        self.db_name = db_name
        self.user_name = user_name
        self.password = password
        self.driver = driver
        self.db_connect()

    def db_connect(self):
        conn_string = f"DRIVER={self.driver};SERVER={self.server_name};DATABASE={self.db_name};UID={self.user_name};PWD={self.password};PORT=1433"
        return pyodbc.connect(conn_string, timeout=consts.SQL_TIMEOUT_SEC)

    def run_query_with_results(self, query):
        try:
            conn = self.db_connect()
            cursor = conn.cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            columns = [element[0] for element in cursor.description]
            return results, columns
        except (pyodbc.Error, Exception) as e:
            print(e)
            return [], []

    def run_query_without_results(self, query):
        try:
            conn = self.db_connect()
            cursor = conn.cursor()
            cursor.execute(query)
        except (pyodbc.Error, Exception):
            return
