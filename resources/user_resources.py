from flask_restful import Resource
from flask import request, make_response


class SignUp(Resource):
    def get(self):
        pass


class Profile(Resource):
    def get(self):
        pass

    def put(self):
        pass


class LogIn(Resource):
    def post(self):
        user_id = request.json.get('user_id')
        if not user_id:
            return 401
        response = make_response()
        response.set_cookie('user_id', )
        return response


class LogOut(Resource):
    def get(self):
        pass
