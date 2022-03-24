

IS_USER_EXISTS = """SELECT user_id FROM users WHERE user_id = {}"""
IS_USER_OF_TYPE = """ AND user_type_id = {} """
TYPE_VOLUNTEER = 1
TYPE_MANAGER = 2


def is_user_in_db(user_id, role=None):
    if role:
        query = IS_USER_EXISTS.format(user_id) + IS_USER_OF_TYPE.format(wanted_role)
    else:
        query = IS_USER_EXISTS.format(user_id)
    given_user_id = SqlQuerier().query(query)
    return bool(given_user_id)
#
#
# def authentication(func, wanted_role=None):
#     def inner(request, *args, **kwargs):
#         user_id = request.cookies.get("user_id", None)
#         if wanted_role:
#             query = IS_USER_EXISTS.format(user_id) + IS_USER_OF_TYPE.format(wanted_role)
#         else:
#             query = IS_USER_EXISTS.format(user_id)
#         user_id = SqlQuerier().query(query)
#         if not user_id:
#             return 401
#         func(request, user_id, *args, **kwargs)
#     return inner
#
#
# def authentication2(wanted_role=None, *args, **kwargs):
#     def inner(func):
#         user_id = request.cookies.get("user_id", None)
#         if wanted_role:
#             query = IS_USER_EXISTS.format(user_id) + IS_USER_OF_TYPE.format(wanted_role)
#         else:
#             query = IS_USER_EXISTS.format(user_id)
#         user_id = SqlQuerier().query(query)
#         if not user_id:
#             return 401
#         func(args[0], user_id, *args, **kwargs)
#     return inner
#
#
# @authentication(wanted_role=1)
# def volunteer_authentication(func):
#     def inner(request, *args, **kwargs):
#         return authentication(request, TYPE_VOLUNTEER)
#     return inner


def volunteer_authentication(func):
    def inner(request, *args, **kwargs):
        user_id = is_user_in_db(request.cookies.get('user_id', None), TYPE_VOLUNTEER)
        if not user_id:
            return 401
        func(request, user_id, *args, **kwargs)
    return inner


def manager_authentication(func):
    def inner(request, *args, **kwargs):
        user_id = is_user_in_db(request.cookies.get('user_id', None), TYPE_MANAGER)
        if not user_id:
            return 401
        func(request, user_id, *args, **kwargs)
    return inner


@volunteer_authentication
def a(x, y, z):
    print(x, y, z)


a(1)