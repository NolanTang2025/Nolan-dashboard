import os
import praw
import webbrowser
from flask import Flask, request

app = Flask(__name__)

CLIENT_ID = 'pFNGzTFPqeF_m9JvKJIK8Q'
CLIENT_SECRET = '0YNYoZht9qOpmtLVxaX6KM2l2fiwAw'
REDIRECT_URI = 'http://localhost:8080'
USER_AGENT = 'dashboard-token-script by Nolan'

reddit = praw.Reddit(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    redirect_uri=REDIRECT_URI,
    user_agent=USER_AGENT
)

auth_url = reddit.auth.url(['identity', 'history', 'read', 'save'], '...', 'permanent')

@app.route('/')
def main():
    code = request.args.get('code')
    refresh_token = reddit.auth.authorize(code)
    return f'Your refresh token is: <br><code>{refresh_token}</code>'

if __name__ == '__main__':
    print(f"Go to this URL and authorize the app:\n{auth_url}")
    webbrowser.open(auth_url)
    app.run(port=8080)
