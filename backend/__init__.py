import os

from flask import Flask
from dotenv import load_dotenv

load_dotenv()

ENVIRONMENT = os.getenv('ENVIRONMENT')

'''
    "static_folder" tells Flask where is the static folder. By default this is a static directory located in the same directory where the application is. We change it to point to build.
    "static_url_path" tells Flask what is the URL prefix for all static files. By default this is /static. We can change it to the root URL, so that we do not need to prepend every static file with /static
'''
app = Flask(__name__) if ENVIRONMENT == 'development' else Flask(__name__, static_folder='./frontend/build', static_url_path='/')

# Import all the files that exposes any route
# Flask goes through all the routes in the specified order
# The first matched route will be triggered

from backend import routes, hello, api
