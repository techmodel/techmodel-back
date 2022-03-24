from flask import Flask
from flask_restful import Api
from resources import Search, SearchParams, ProfileParams, Profile, LogIn, LogOut, UserTypes


app = Flask(__name__)
api = Api(app)


def init_resources():
    # api.add_resource(UserTypes, '/user_types')
    # api.add_resource(ProfileParams, '/profile_params/<string:user_type>')
    # api.add_resource(Profile, '/profile/<string:user_type>')
    api.add_resource(LogIn, '/login')
    # api.add_resource(LogOut, '/logout')
    # api.add_resource(Search, '/search_params/<string:user_type>')
    api.add_resource(SearchParams, '/search/<string:user_type>')


def main():
    init_resources()
    app.run()
