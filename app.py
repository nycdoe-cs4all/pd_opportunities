from __future__ import print_function
from flask import Flask, Response
from flask import request
from helpers import retrieve_data
import json

app = Flask(__name__, static_url_path='')
app.config['DEBUG'] = True

@app.route('/')
def home():
    return app.send_static_file("index.html")

@app.route('/all')
def all():
    data = retrieve_data('1wSAg1nrbBXS80o6fHoJFWinLalvVnS9gQqQCexMn65k', 'Data!A1:AB')
    data = json.dumps(data)
    resp = Response(response=data, status=200, mimetype="application/json")
    return resp

@app.route('/glossary')
def glossary():
    data = retrieve_data('1NCp-R2gipFeuG5l19iBeJxLf8N5oQUY9Qj3roWA8SLE', 'A1:AM')
    data = json.dumps(data)
    if 'term' in request.args:
        #checks to see if a request for a term was included
        if not json.loads(data)[0][request.args['term']]:
            # checks to see if the term is in the glossary
            resp = Response(response='Term is not in glossary!', status=200, mimetype="text/plain")
        else:
            data = json.loads(data)[0][request.args['term']] #converts JSON to a dictionary and loads the relevant definition
            resp = Response(response=data, status=200, mimetype="text/plain")
    resp = Response(response=data, status=200, mimetype="application/json") #otherwise prints the whole json dump
    return resp

@app.route('/ican')
def ican():
    data = retrieve_data('1p99JEXZEuGtAGmu7sTCpF8En7ItY5yaag8GdGXm8amw', 'A1:D')
    data = json.dumps(data)
    resp = Response(response=data, status=200, mimetype="application/json")
    return resp

if __name__ == '__main__':
    app.run()
