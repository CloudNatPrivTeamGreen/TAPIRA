import json
import time

import requests
from flask import request, Response
from flask.views import MethodView
from flask_smorest import Blueprint, abort

from backend import config as config
from backend import models as models
from backend.schema import schema
from backend.services import collection_service as s

##################################################
# Variable Definition
test_blp = Blueprint("testing",
                "testing",
                url_prefix="/test",
                description="Endpoints for easier testing"
                )