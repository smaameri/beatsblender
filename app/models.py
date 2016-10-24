from datetime import datetime, timedelta
import jwt

from app import db
from app import app


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
