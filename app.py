from flask import Flask
from flask_restful import Api
from flask_cors import CORS
from resources import Search, Profile, LogIn, LogOut
from resources.types_resources import Types, ProfileParams

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
api = Api(app)


def init_resources():
    api.add_resource(Types, '/api/types/<string:param_name>')

    api.add_resource(ProfileParams, '/api/profile_params/<string:user_type>')
    api.add_resource(Profile, '/api/profile/<string:user_type>')
    api.add_resource(LogIn, '/api/login')
    api.add_resource(LogOut, '/api/logout')
    api.add_resource(Search, '/api/search/<string:user_type>')


def main():
    init_resources()
    app.run(host='0.0.0.0', port=8080)


if __name__ == "__main__":
    main()
