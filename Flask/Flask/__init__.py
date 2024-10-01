from flask import Flask
from os import path
from flask_login import LoginManager


def create_app():
    app = Flask(__name__)
    from .views import views

    app.register_blueprint(views, url_prefix='/')
    
    return app
