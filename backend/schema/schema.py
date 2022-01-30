from marshmallow import Schema, fields


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


class RecentApiSpecSchema(Schema):
    recent_api_spec = fields.Str()
    service = fields.Str()


class ServicesSchema(Schema):
    services = fields.List(fields.Str)


class ApiClaritySpecsSchema(Schema):
    updated_provided_services = fields.List(fields.Str)
    updated_reconstructed_services = fields.List(fields.Str)
