from flask import Flask, Response
from helpers import retrieve_data
import json
app = Flask(__name__, static_url_path='')
app.config['DEBUG'] = True

@app.route('/')
def home():
    return app.send_static_file("index.html")

@app.route('/all')
def all():
    print "someone asked for data"
    data = retrieve_data()
    data = json.dumps(data)
    resp = Response(response=data, status=200, mimetype="application/json")
    return resp

if __name__ == '__main__':
    app.run()