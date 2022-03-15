from enum import Enum

from flask_rest_api.fields import Upload
from marshmallow import Schema, fields
from marshmallow import post_load
from marshmallow_enum import EnumField

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


class VersionsSchema(Schema):
    versions = fields.List(fields.Str)


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
    summary = fields.Str(default=None, missing=None, allow_none=True)
    path_is_new = fields.Boolean(default=True)


class MissingEndpointSchema(Schema):
    path_url = fields.Str(default=None, allow_none=True)
    method = fields.Str(default=None, allow_none=True)
    summary = fields.Str(default=None, missing=None, allow_none=True)
    path_is_still_present = fields.Boolean(default=False)


class ChangedOperationSchema(Schema):
    path_url = fields.Str(default=None, allow_none=True)
    method = fields.Str(default=None, allow_none=True)
    changed_fields = fields.List(fields.Str(default=None, allow_none=True), default=[], allow_none=True)


class ApiDiffsResponseSchema(Schema):
    general_difference_given = fields.Boolean(default=None, allow_none=True)
    potentially_privacy_related_differences_given = fields.Boolean(default=None, allow_none=True)
    new_endpoints = fields.List(fields.Nested(NewEndpointSchema), default=[], allow_none=True)
    missing_endpoints = fields.List(fields.Nested(MissingEndpointSchema), default=[], allow_none=True)
    changed_operations = fields.List(fields.Nested(ChangedOperationSchema), default=[], allow_none=True)

    @post_load
    def make_api_diffs(self, data, **kwargs):
        print("opaaa")
        return ApiDiffs(**data)


class ConflictsReponseSchema(Schema):
    api_diffs = fields.Nested(ApiDiffsResponseSchema, default=None, allow_none=True)


class ChangedGlobalTiraAnnotationSchema(Schema):
    key = fields.Str(default=None, allow_none=True)
    old_global_tira_annotation = fields.Dict(default=None, allow_none=True)
    new_global_tira_annotation = fields.Dict(default=None, allow_none=True)


class SchemaTiraAnnotation(Schema):
    schema_name = fields.Str(default=None, allow_none=True)
    schema_tira_annotation = fields.Dict(default=None, allow_none=True);


class ChangedSchemaTiraAnnotation(Schema):
    schema_name = fields.Str(default=None, allow_none=True)
    old_schema_tira_annotation = fields.Dict(default=None, allow_none=True);
    new_schema_tira_annotation = fields.Dict(default=None, allow_none=True);


class ApiDiffTiraSchema(Schema):
    new_global_tira_annotation = fields.List(fields.Dict(), default=[], allow_none=True)
    missing_global_tira_annotation = fields.List(fields.Dict(), default=[], allow_none=True)
    changed_global_tira_annotation = fields.List(
        fields.Nested(ChangedGlobalTiraAnnotationSchema, default=None, allow_none=True), default=[],
        allow_none=True)

    new_schema_tira_annotations = fields.List(fields.Nested(SchemaTiraAnnotation), default=[], allow_none=True)

    missing_schema_tira_annotations = fields.List(fields.Nested(SchemaTiraAnnotation), default=[], allow_none=True)
    changed_schema_tira_annotations = fields.List(fields.Nested(ChangedSchemaTiraAnnotation), default=[],
                                                  allow_none=True)


class ProposedMergeParameterSchema(Schema):
    context = fields.Str()


class ProposedMergeRequestBodySchema(Schema):
    old_api = fields.Dict()
    new_api = fields.Dict()


class ProposedMergeResponseSchema(Schema):
    proposed_merge = fields.Dict()


class EvolutionQueryParamsSchema(Schema):
    service = fields.Str(required=True)
    old_version = fields.Str(required=True)
    new_version = fields.Str(required=True)


class AllChangesComparisonSchema(Schema):
    service = fields.Str(required=True)
    api_diffs = fields.Nested(ApiDiffsResponseSchema, default=None, allow_none=True)
    tira_diffs = fields.Nested(ApiDiffTiraSchema, default=None, allow_none=True)

class TiraChangesComparisonSchema(Schema):
    schemas = fields.Dict()
    global_changes = fields.Dict()
    paths = fields.Dict()



class ComparisonParameterSchema(Schema):
    service = fields.Str(required=True)


class RecordStatusEnum(Enum):
    ON = 1
    OFF = 2


class RecordStatus(Schema):
    record_status = EnumField(RecordStatusEnum)


class ReportSchema(Schema):
    report = fields.Dict()
    total_calls = fields.Int()
    start_timestamp = fields.Str(required=True)
    end_timestamp = fields.Str(required=True)
    services = fields.Dict()


class AllReportsSchema(Schema):
    reports = fields.List(fields.Nested(ReportSchema(), default=None, allow_none=True), default=[], allow_none=True)
