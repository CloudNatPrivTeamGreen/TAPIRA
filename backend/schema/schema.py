from flask_rest_api.fields import Upload
from marshmallow import Schema, fields


class QueryParamsSchema(Schema):
    service = fields.Str(required=True)
    version = fields.Str(required=False)


class ApiSpecEntrySchema(Schema):
    name = fields.Str(required=True)
    version = fields.Str()
    api_spec = fields.Str()
    created_at_date = fields.Str()


class ApiSpecsSchema(Schema):
    api_specs = fields.List(fields.Nested(ApiSpecEntrySchema))


class CurrentApiResponseSchema(Schema):
    recent_api_spec = fields.Nested(ApiSpecEntrySchema)
    service_name = fields.Str()


class ServicesSchema(Schema):
    services = fields.List(fields.Str)


class ApiClaritySpecsSchema(Schema):
    reconstructed_services = fields.List(fields.Str)


class HousekeepingSchema(Schema):
    number_of_deleted = fields.Str()


class ServiceNameParameterSchema(Schema):
    service = fields.Str(required=True)


class ProposalSchema(Schema):
    proposal = fields.Str()


class UploadSchema(Schema):
    file = Upload(required=True)


class UploadResponseSchema(Schema):
    created_version = fields.Str()

class ProposedMergeParameterSchema(Schema):
    context = fields.Str()

class ProposedMergeRequestBodySchema(Schema):
    old_api = fields.Dict()
    new_api = fields.Dict()
    api_diff = fields.Dict()