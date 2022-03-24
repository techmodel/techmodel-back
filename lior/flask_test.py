from flask import Flask, request
from search_on_db import search_filters
APP = Flask(__name__)


@APP.route('/hello', methods=['GET'])
def hello():
    return "OK"


@APP.route('/search', methods=['POST'])
def search():
    body = request.json
    return search_filters(body)


if __name__ == '__main__':
    APP.run(host="0.0.0.0",port=6200)