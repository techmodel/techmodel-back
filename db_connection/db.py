import pyodbc
from db_connection import consts
from db_connection.exceptions import DBError


#TODO: REMOVE THIS AND UNITE IT WITH THE SQL CLASS


class DB:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(DB, cls).__new__(cls)
            cls._instance._conn = DB.connect(*args, **kwargs)
            cls._instance._cursor = cls._instance._conn.cursor()
        return cls._instance

    @staticmethod
    def connect(driver, server_name, db_name, user_name, password):
        conn_string = f"DRIVER={driver};SERVER={server_name};DATABASE={db_name};UID={user_name};PWD={password};PORT=1433"
        return pyodbc.connect(conn_string, timeout=consts.SQL_TIMEOUT_SEC)

    def run_query_with_results(self, query):
        try:
            self._cursor.execute(query)
            results = self._cursor.fetchall()
            columns = [element[0] for element in self._cursor.description]
            return results, columns
        except (pyodbc.Error, Exception) as e:
            raise DBError(e)
