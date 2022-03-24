# from flask import Flask, request
# from presenters.search import SearchEngine
# from presenters.union_user_data import union_user_data
#
# APP = Flask(__name__)
#
#
# @APP.route('/search', methods=['POST'])
# def search():
#     body = request.json
#     search_engine=SearchEngine()
#     results=search_engine.search(body)
#     unuion_data=union_user_data(results)
#     return {"results": unuion_data}
#
#
# if __name__ == '__main__':
#     APP.run(host="0.0.0.0", port=6200)
