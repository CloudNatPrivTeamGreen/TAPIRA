from flask_rest_api.fields import Upload
from marshmallow import Schema, fields, post_load
from backend.models.models import *


class QueryParamsSchema(Schema):
    service = fields.Str(required=True)
    version = fields.Str(required=False)


class ApiSpecEntrySchema(Schema):
    name = fields.Str(required=True)
    version = fields.Str()
    api_spec = fields.Dict()
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
    proposal = fields.Dict()


class UploadSchema(Schema):
    file = Upload(required=True)


class UploadResponseSchema(Schema):
    created_version = fields.Str()


class ApiDiffParameterSchema(Schema):
    pass


class ApiDiffBodySchema(Schema):
    old_api_spec = fields.Dict(data_key="oldApiSpec", required=True)
    new_api_spec = fields.Dict(data_key="newApiSpec", required=True)


class ApiDiffRequestSchema(Schema):
    apiSpecPair = fields.Nested(ApiDiffBodySchema)


class NewEndpointSchema(Schema):
    path_url: fields.Str()
    method: fields.Str()
    summary: fields.Str()
    path_is_new: fields.Boolean()


class EndpointSchema(Schema):
    path_url: fields.Str()
    method: fields.Str()
    summary: fields.Str()
    path_is_new: fields.Boolean()


class MissingEndpointSchema(Schema):
    path_url: fields.Str()
    method: fields.Str()
    summary: fields.Str()
    path_is_still_present: fields.Boolean()


class ChangedOperationSchema(Schema):
    path_url: fields.Str()
    method: fields.Str()
    changed_fields: fields.List(fields.Str())


class ApiDiffsResponseSchema(Schema):
    general_difference_given: fields.Boolean()
    potentially_privacy_related_differences_given: fields.Boolean()
    new_endpoints: fields.List(fields.Nested(EndpointSchema))
    missing_endpoints: fields.List(fields.Nested(MissingEndpointSchema))
    changed_operations: fields.List(fields.Nested(ChangedOperationSchema))
