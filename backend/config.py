import os

KUBERNETES_CLUSTER_BASE_HOST = "192.168.49.2"
LOCALHOST = "localhost"

APICLARITY_POSTGREST_HOST = os.getenv("api_clarity_postgrest_host", default=KUBERNETES_CLUSTER_BASE_HOST)
APICLARITY_POSTGREST_PORT = os.getenv("api_clarity_postgrest_port", default=32231)
APICLARITY_POSTGREST_URL = f'http://{APICLARITY_POSTGREST_HOST}:{APICLARITY_POSTGREST_PORT}'

APICLARITY_API_HOST = os.getenv("api_clarity_host", default=KUBERNETES_CLUSTER_BASE_HOST)
APICLARITY_API_PORT = os.getenv("api_clarity_port", default=31999)
APICLARITY_API_URL = f'http://{APICLARITY_API_HOST}:{APICLARITY_API_PORT}'

APIDIFF_HOST = os.getenv("apidiff_host", default=KUBERNETES_CLUSTER_BASE_HOST)
APIDIFF_PORT = os.getenv("apidiff_port", default=32230)
APIDIFF_URL = f'http://{APIDIFF_HOST}:{APIDIFF_PORT}'

mongodb_host = os.getenv("mongodb_host", default=KUBERNETES_CLUSTER_BASE_HOST)
mongodb_port = os.getenv("mongodb_port", default=32000)
mongodb_user = os.getenv("MONGODB_USER", default="adminuser")
mongodb_password = os.getenv("MONGODB_PASSWORD", default="password123")


class Config:
    """Default configuration"""
    API_VERSION = 0.1
    API_TITLE = 'TAPIRA_Api'
    OPENAPI_VERSION = "3.0.2"
    OPENAPI_JSON_PATH = "api-spec.json"
    OPENAPI_URL_PREFIX = "/"
    OPENAPI_REDOC_PATH = "/redoc"
    OPENAPI_SWAGGER_UI_PATH = "/swagger-ui"
    OPENAPI_RAPIDOC_PATH = "/rapidoc"
    API_SPEC_OPTIONS = {
        'info': {'description': 'Api for the TAPIRA backend',
                 'contact': {
                     'email': 'test@swagger.io'
                 },
                 'license': {
                     'name': 'MIT License',
                     'url': 'https://fr.wikipedia.org/wiki/Licence_MIT'
                 }
                 }
    }

    MONGO_URI = f'mongodb://{mongodb_user}:{mongodb_password}@{mongodb_host}:{mongodb_port}/api_repo?authSource=admin'
