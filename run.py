from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
  return render_template('index.html')
  
  
@app.route('/player')
def player():
  return render_template('player.html')
  