from flask import Flask, request
from flask_restful import Resource, Api
from resources import Search


app = Flask(__name__)
api = Api(app)


def init_resources():
    api.add_resource(SignUp, '/signup_params')
    api.add_resource(Profile, '/profile')
    api.add_resource(LogIn, '/login')
    api.add_resource(Search, '/')
