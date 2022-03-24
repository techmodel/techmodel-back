from flask import request


IS_USER_EXISTS = """SELECT user_id FROM users WHERE user_id = {}"""
IS_USER_OF_TYPE = """ AND user_type_id = {} """
TYPE_VOLUNTEER = 1
TYPE_MANAGER = 2


def is_user_in_db(user_id, role=None):
    if role:
        query = IS_USER_EXISTS.format(user_id) + IS_USER_OF_TYPE.format(role)
    else:
        query = IS_USER_EXISTS.format(user_id)
    given_user_id = SqlQuerier().query(query)
    return bool(given_user_id)


def volunteer_authentication(func):
    def inner(*args, **kwargs):
        user_id = request.cookies.get('user_id', None)
        if not is_user_in_db(user_id, TYPE_VOLUNTEER):
            return 401, "This operation requires a volunteer user"
        func(user_id, *args, **kwargs)
    return inner


def manager_authentication(func):
    def inner(*args, **kwargs):
        user_id = request.cookies.get('user_id', None)
        if not is_user_in_db(user_id, TYPE_MANAGER):
            return 401, "This operation requires a manager user"
        func(user_id, *args, **kwargs)
    return inner


@volunteer_authentication
def a(x, y, z):
    print(x, y, z)
