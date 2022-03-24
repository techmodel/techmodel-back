FILTERS_QUERY = """
select * from users_info where user_id in (
    SELECT distinct user_id
    FROM users_info
    WHERE user_type = '{user_type}' 
    {conditions}
)
"""

