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
