from flask import Flask

import json
import os

import flask
import jwt
import requests
from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from jwt import DecodeError, ExpiredSignature

app = Flask(__name__)
app.config.from_object(os.environ['APP_SETTINGS'])
print(os.environ['APP_SETTINGS'])
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['TOKEN_SECRET'] = 'dd3bf68702nd7rn0sk28s13a35e66376'
app.config['FACEBOOK_SECRET'] = 'dd3bf68700daa6d9f8e9213a35e66376'
app.config['GOOGLE_SECRET'] = 'XaQjG-Y5vZwpv4s0yop0iUBY'

db = SQLAlchemy(app)

if os.path.exists('app/db.sqlite'):
    print 'DB EXISTS'
    os.remove('app/db.sqlite')

from datetime import datetime, timedelta
import jwt

from app import views, satellizer, models


db.create_all()

