from __future__ import print_function
from flask import Flask, Response
import httplib2
import os
import json


from apiclient import discovery
from oauth2client import client
from oauth2client import tools
from oauth2client.file import Storage

try:
    import argparse
    flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args()
except ImportError:
    flags = None

SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly'
CLIENT_SECRET_FILE = 'client_secret.json'
APPLICATION_NAME = 'Google Sheets API Python Quickstart'

def get_credentials():
    """Gets valid user credentials from storage.

    If nothing has been stored, or if the stored credentials are invalid,
    the OAuth2 flow is completed to obtain the new credentials.

    Returns:
        Credentials, the obtained credential.
    """
    # home_dir = os.path.expanduser('~')
    # credential_dir = os.path.join(home_dir, '.credentials')
    # if not os.path.exists(credential_dir):
    #     os.makedirs(credential_dir)
    # credential_path = os.path.join(credential_dir,
    #                                'sheets.googleapis.com-python-quickstart.json')
    
    store = Storage(credential_path)
    credentials = store.get()
    if not credentials or credentials.invalid:
        flow = client.flow_from_clientsecrets(CLIENT_SECRET_FILE, SCOPES)
        flow.user_agent = APPLICATION_NAME
        if flags:
            credentials = tools.run_flow(flow, store, flags)
        else: # Needed only for compatibility with Python 2.6
            credentials = tools.run(flow, store)
        print('Storing credentials to ' + credential_path)
    return credentials

def retrieve_data():
    """Shows basic usage of the Sheets API.

    Creates a Sheets API service object and prints the names and majors of
    students in a sample spreadsheet:
    https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
    """
    credentials = get_credentials()
    http = credentials.authorize(httplib2.Http())
    discoveryUrl = ('https://sheets.googleapis.com/$discovery/rest?'
                    'version=v4')
    service = discovery.build('sheets', 'v4', http=http,
                              discoveryServiceUrl=discoveryUrl)

    spreadsheetId = '1wSAg1nrbBXS80o6fHoJFWinLalvVnS9gQqQCexMn65k'
    rangeName = 'Data!A1:W'
    result = service.spreadsheets().values().get(
        spreadsheetId=spreadsheetId, range=rangeName).execute()
    data = result.get('values', [])
    if not data:
        return 0
    else:
        values = data[1:]
        keys = data[0]
        json_data = []
        for row in values:
            provider_data = {}
            for k in range(0,len(keys)):
                key = keys[k]
                provider_data[key]=row[k]
            json_data.append(provider_data)
        return json_data

app = Flask(__name__, static_url_path='')
# app.config['DEBUG'] = True

@app.route('/')
def home():
    return app.send_static_file("index.html")

@app.route('/all')
def all():
    data = retrieve_data()
    data = json.dumps(data)
    resp = Response(response=data, status=200, mimetype="application/json")
    return resp

if __name__ == '__main__':
    app.run()