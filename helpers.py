from __future__ import print_function

from oauth2client.service_account import ServiceAccountCredentials
from httplib2 import Http
from apiclient.discovery import build


# try:
#     import argparse
#     flags = argparse.ArgumentParser(parents=[tools.argparser]).parse_args()
# except ImportError:
#     flags = None



def get_credentials():
    scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly']
    credentials = ServiceAccountCredentials.from_json_keyfile_name(
    'PD-Opportunities-be4d7d250c01.json', scopes)
    return credentials

def retrieve_data(spreadsheetId, rangeName):
    """Shows basic usage of the Sheets API.

    Creates a Sheets API service object and prints the names and majors of
    students in a sample spreadsheet:
    https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
    """
    credentials = get_credentials()
    http = credentials.authorize(Http())
    discoveryUrl = ('https://sheets.googleapis.com/$discovery/rest?'
                    'version=v4')
    service = build('sheets', 'v4', http=http,
                              discoveryServiceUrl=discoveryUrl)
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
                try:
                    provider_data[key]=row[k]
                except:
                    provider_data[key]=""
            json_data.append(provider_data)
        return json_data

if __name__ == '__main__':
    main()
