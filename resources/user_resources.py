from flask_restful import Resource


class UserTypes(Resource):
    # returns all users types from db
    def get(self):
        pass


class ProfileParams(Resource):
    # return profile params by user_type
    def get(self, user_type):
        pass


# get/post/update user profile by user_type
# user_id in headers
class Profile(Resource):
    def get(self, user_type):
        pass

    def post(self, user_type):
        pass

    def put(self, user_type):
        pass


class LogIn(Resource):
    def post(self):
        pass


class LogOut(Resource):
    def get(self):
        pass