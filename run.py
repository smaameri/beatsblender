from flask import Flask, render_template, make_response

app = Flask(__name__)

@app.route('/')
def index():
    return make_response(open('templates/index.html').read())
