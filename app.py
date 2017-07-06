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
    data = retrieve_data('1NCp-R2gipFeuG5l19iBeJxLf8N5oQUY9Qj3roWA8SLE', 'A1:B')
    data = json.loads(json.dumps(data)) #this creates an array of dicts
    if 'term' in request.args:
        reqTerm = request.args['term'].lower()
        foundWord = 0 #flag to see if the word has been found in the glossary
        #checks to see if a request for a term was included
        for x in data:
            #iterate through the entire glossary and find the term you need
            if (x['Term'] == reqTerm):
                resp = Response(response=x['Definition'], status=200, mimetype="text/plain")
                foundWord = 1 #set flag
                continue #if the word was found, exit the loop
        if foundWord == 0:
            #if the word wasn't found, return an error message
            resp = Response(response='Could not find term in glossary', status=200, mimetype="text/plain")
    else:
        resp = Response(response='No term for you!', status=200, mimetype="text/plain") #otherwise prints an error message
    return resp

@app.route('/ican')
def ican():
    data = retrieve_data('1p99JEXZEuGtAGmu7sTCpF8En7ItY5yaag8GdGXm8amw', 'A1:D')
    data = json.dumps(data)
    resp = Response(response=data, status=200, mimetype="application/json")
    return resp

if __name__ == '__main__':
    app.run()
