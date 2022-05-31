from collections import namedtuple
import os

UserInfo = namedtuple("UserInfo", ("id", "type"))

# jwt consts
JWT_NUM_HOURS_FOR_COOKIE = 1
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"
