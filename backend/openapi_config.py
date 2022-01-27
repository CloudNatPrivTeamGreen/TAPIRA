from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from apispec_webframeworks.flask import FlaskPlugin
from marshmallow import Schema, fields

spec = APISpec(
    title="Demo API",
    version="1.0.0",
    openapi_version="3.0.2",
    info=dict(
        description="Tapira API",
        version="1.0.0-oas3",
        contact=dict(
            email="test@test.com"
        ),
        license=dict(
            name="Apache 2.0",
            url='http://www.apache.org/licenses/LICENSE-2.0.html'
        )
    ),
    tags=[
        dict(
            name="Mock",
            description="Endpoints returning dummy responses"
        )
    ],
    plugins=[FlaskPlugin(), MarshmallowPlugin()],
)


class QueryParamsSchema(Schema):
    service = fields.Str(required=True)
    type = fields.Str(required=False)
    version = fields.Str(required=False)


class ApiSpecEntrySchema(Schema):
    name = fields.Str(required=True)
    version = fields.Str()
    api_spec = fields.Str()
    created_at_date = fields.Str()


class ApiSpecsSchema(Schema):
    api_specs = fields.List(fields.Nested(ApiSpecEntrySchema))


spec.components.schema("ApiSpecEntrySchema", schema=ApiSpecEntrySchema)
spec.components.schema("ApiSpecsSchema", schema=ApiSpecsSchema)
spec.components.schema("QueryParamsSchema", schema=QueryParamsSchema)
