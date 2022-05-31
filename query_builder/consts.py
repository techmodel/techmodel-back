from enum import Enum


class FilterType(Enum):
    SINGLE = "single"
    MULTIPLE = "multiple"


ENUM_SELECT_QUERY = """SELECT id, [name] from {table}"""

FILTERS_QUERY = """
select * from users_info where user_id in (
    SELECT distinct user_id
    FROM users_info
    WHERE user_type = '{user_type}' 
    {conditions}
)
"""

