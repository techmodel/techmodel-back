from flask import Flask, Response
from flask_restful import Resource, Api


app = Flask(__name__)
api = Api(app)


class HelloWorld(Resource):
    def get(self):
        return Response('hello world', status=200)


api.add_resource(HelloWorld, '/')

if __name__ == '__main__':
    app.run()
