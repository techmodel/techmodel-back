from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from resources import Search, SearchParams, Profile, LogIn, LogOut
from resources.types_resources import UserTypes, LanguageTypes, EventFocusTypes, GendersTypes, GeoAreaTypes, \
    PopulationTypes

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
api = Api(app)


def init_resources():
    api.add_resource(UserTypes, '/api/user_types')
    api.add_resource(LanguageTypes, '/api/language_types')
    api.add_resource(EventFocusTypes, '/api/event_focus_types')
    api.add_resource(GendersTypes, '/api/gender_types')
    api.add_resource(GeoAreaTypes, '/api/geo_areas_types')
    api.add_resource(PopulationTypes, '/api/population_types')

    # api.add_resource(ProfileParams, '/profile_params/<string:user_type>')
    api.add_resource(Profile, '/api/profile/<string:user_type>')
    api.add_resource(LogIn, '/api/login')
    api.add_resource(LogOut, '/api/logout')
    api.add_resource(Search, '/api/search/<string:user_type>')
    # api.add_resource(SearchParams, '/search_params/<string:user_type>')


def main():
    init_resources()
    app.run(host='0.0.0.0', port=8080)


if __name__ == "__main__":
    main()
