import pyodbc

import consts
from daos.sql import SQLDao

if __name__ == '__main__':
    sql = SQLDao(server_name=consts.SQL_SERVER, db_name=consts.SQL_DB, user_name=consts.SQL_USERNAME,
                 password=consts.SQL_PASSWORD, driver=consts.SQL_DRIVER)
    print(sql.run_query_with_results(f"select * from [{consts.SQL_DB}].[dbo].[test]"))
    print(f"select * from [{consts.SQL_DB}].[dbo].[test]")
