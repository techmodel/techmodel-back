from flask import Flask
from flask_restful import Api
from resources import Search, SearchParams, ProfileParams, Profile, LogIn, LogOut
from resources.types_resources import UserTypes, LanguageTypes

app = Flask(__name__)
api = Api(app)


def init_resources():
    api.add_resource(UserTypes, '/api/user_types')
    api.add_resource(LanguageTypes, '/api/language_types')
    # api.add_resource(ProfileParams, '/profile_params/<string:user_type>')
    # api.add_resource(Profile, '/profile/<string:user_type>')
    api.add_resource(LogIn, '/api/login')
    api.add_resource(LogOut, '/api/logout')
    api.add_resource(Search, '/api/search/<string:user_type>')
    #api.add_resource(Search, '/search')
    # api.add_resource(SearchParams, '/search_params/<string:user_type>')


def main():
    init_resources()
    app.run(host='0.0.0.0', port=8080)


if __name__ == "__main__":
    main()
