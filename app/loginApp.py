class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), nullable=False)
    
    facebook_id = db.Column(db.String(100))  # facebook_id
    google_id = db.Column(db.String(100))  # facebook_id
    
    password = db.Column(db.String(100))
    google = db.Column(db.String(120))

    def token(self):
        payload = {
            'sub': self.id,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(days=14)
        }
        token = jwt.encode(payload, app.config['TOKEN_SECRET'])
        return token.decode('unicode_escape')


if os.path.exists('db.sqlite'):
    os.remove('db.sqlite')

db.create_all()

def parse_token(req):
    token = req.headers.get('Authorization').split()[1]
    return jwt.decode(token, app.config['TOKEN_SECRET'])


@app.route('/auth/signup', methods=['POST'])
def signup():
    data = request.json

    email = data["email"]
    password = data["password"]

    user = User(email=email, password=password)
    db.session.add(user)
    db.session.commit()

    return jsonify(token=user.token())


@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify(error="No such user"), 404

    if user.password == password:
        return jsonify(token=user.token()), 200
    else:
        return jsonify(error="Wrong email or password"), 400


@app.route('/user')
def user_info():
    if not request.headers.get('Authorization'):
        return jsonify(error='Authorization header missing'), 401

    token = request.headers.get('Authorization').split()[1]
    try:
        payload = jwt.decode(token, app.config['TOKEN_SECRET'])
    except DecodeError:
        return jsonify(error='Invalid token'), 401
    except ExpiredSignature:
        return jsonify(error='Expired token'), 401
    else:
        user_id = payload['sub']
        user = User.query.filter_by(id=user_id).first()
        if user is None:
            return jsonify(error='Should not happen ...'), 500

        return jsonify(id=user.id, name=user.name, email=user.email), 200

    return jsonify(error="never reach here..."), 500


@app.route('/auth/facebook', methods=['POST'])
def auth_facebook():
    print 'Facebook Login Started'
    access_token_url = 'https://graph.facebook.com/v2.3/oauth/access_token'
    graph_api_url = 'https://graph.facebook.com/v2.5/me?fields=id,email,name'

    params = {
        'client_id': request.json['clientId'],
        'redirect_uri': request.json['redirectUri'],
        'client_secret': app.config['FACEBOOK_SECRET'],
        'code': request.json['code']
    }

    # Exchange authorization code for access token.
    r = requests.get(access_token_url, params=params)
    # use json.loads instad of urlparse.parse_qsl
    access_token = json.loads(r.text)
    print 'Access Token'
    print access_token
    print ""
    # Step 2. Retrieve information about the current user.
    r = requests.get(graph_api_url, params=access_token)
    profile = json.loads(r.text)
    print 'Profile'
    print profile
    print ""
    
    # Step 3. Create a new account or return an existing one.
    user = User.query.filter_by(facebook_id=profile['id']).first()
    if user:
        return jsonify(token=user.token(), name=user.name, email=user.email)

    u = User(facebook_id=profile['id'], email=profile['email'], name=profile['name'])
    db.session.add(u)
    db.session.commit()
    return jsonify(token=u.token(), name=u.name, email=u.email)

@app.route('/auth/google', methods=['POST'])
def google():
    access_token_url = 'https://accounts.google.com/o/oauth2/token'
    people_api_url = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect'

    payload = dict(client_id=request.json['clientId'],
                   redirect_uri=request.json['redirectUri'],
                   client_secret=app.config['GOOGLE_SECRET'],
                   code=request.json['code'],
                   grant_type='authorization_code')

    # Step 1. Exchange authorization code for access token.
    r = requests.post(access_token_url, data=payload)
    token = json.loads(r.text)
    headers = {'Authorization': 'Bearer {0}'.format(token['access_token'])}
    print 'token: '
    print  token
    print
    # Step 2. Retrieve information about the current user.
    r = requests.get(people_api_url, headers=headers)
    profile = json.loads(r.text)
    print 'profile: '
    print  profile
    print

    # Step 4. Create a new account or return an existing one.
    user = User.query.filter_by(google_id=profile['sub']).first()
    if user:
        return jsonify(token=user.token(), name=user.name, email=user.email)
    u = User(google_id=profile['sub'],
             name=profile['name'],
             email=profile['email'])
    db.session.add(u)
    db.session.commit()
    print 'User'
    print u.name
    return jsonify(token=u.token(), name=u.name, email=u.email)
