
from flask import make_response

from app import app

@app.route('/')
def index():
    return make_response(open('app/templates/index.html').read())
