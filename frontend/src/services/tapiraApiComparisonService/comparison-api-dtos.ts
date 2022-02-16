export interface INewEndpoint {
  path_is_new: boolean;
  path_url: string;
  summary: string;
  method: string;
}

export interface IMissingEndpoint {
  path_is_still_present: boolean;
  path_url: string;
  summary: string;
  method: string;
}

export interface IChangedOperation {
  path_url: string;
  method: string;
  changed_fields: string[];
}

export interface IApiDiffs {
  general_difference_given: boolean;
  potentially_privacy_related_differences_given: boolean;
  new_endpoints: INewEndpoint[];
  missing_endpoints: IMissingEndpoint[];
  changed_operations: IChangedOperation[];
}

export enum ProposedMergeContext {
  Validation = 'validation',
  Comparison = 'comparison',
}

export interface IProposedMergeBody {
  new_api: any;
  old_api: any;
}

export enum EndpointTypes {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE',
}

export enum RequestInfo {
  parameter = 'parameter',
  header = 'header',
  responseBody = 'responseBody',
  requestBody = 'requestBody',
}

export interface TiraAnnotationInfo {
  is_removed: boolean;
  new: any;
  old: any;
}

export type PDIndicatorInfo = {
  [key in RequestInfo]?: { [key: string]: TiraAnnotationInfo };
} & {
  is_removed: boolean;
};

export type EvolutionEndpointInfo = {
  [key in EndpointTypes]?: PDIndicatorInfo;
} & {
  is_removed: boolean;
};

export interface EvolutionResponse {
  [endpoint: string]: EvolutionEndpointInfo;
}
