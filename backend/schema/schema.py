from flask_rest_api.fields import Upload
from marshmallow import Schema, fields
from marshmallow import post_load

from backend.models.models import ApiDiffs


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
    path_url = fields.Str(default=None, allow_none=True)
    method = fields.Str(default=None, allow_none=True)
    summary = fields.Str(default=None, allow_none=True)
    path_is_new = fields.Boolean(default=True)


class MissingEndpointSchema(Schema):
    path_url = fields.Str(default=None, allow_none=True)
    method = fields.Str(default=None, allow_none=True)
    summary = fields.Str(default=None)
    path_is_still_present = fields.Boolean(default=False)


class ChangedOperationSchema(Schema):
    path_url = fields.Str(default=None, allow_none=True)
    method = fields.Str(default=None, allow_none=True)
    changed_fields = fields.List(fields.Str(default=None, allow_none=True))


class ApiDiffsResponseSchema(Schema):
    general_difference_given = fields.Boolean(default=None, allow_none=True)
    potentially_privacy_related_differences_given = fields.Boolean(default=None, allow_none=True)
    new_endpoints = fields.List(fields.Nested(NewEndpointSchema))
    missing_endpoints = fields.List(fields.Nested(MissingEndpointSchema))
    changed_operations = fields.List(fields.Nested(ChangedOperationSchema))

    @post_load
    def make_api_diffs(self, data, **kwargs):
        print("opaaa")
        return ApiDiffs(**data)

class ProposedMergeParameterSchema(Schema):
    context = fields.Str()

class ProposedMergeRequestBodySchema(Schema):
    old_api = fields.Dict()
    new_api = fields.Dict()
    api_diff = fields.Dict()
    tira_diff = fields.Dict()
