# ECO Tracker - Google App Engine Entry Point
# This file is required by App Engine but our app is purely static

from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
    """Redirect to static index.html"""
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=8080)