export interface JsonApiError {
  code?: number;
  message?: string;
  errors?: { id: string; title: string; status?: number }[];
}

export interface JsonApiData {
  uid: string;
  kind: string;
  version: number;
}

export interface ObjectJsonApiData extends JsonApiData {}

export interface ObjectJsonApiDataList<T = ObjectJsonApiData> extends ObjectJsonApiData {
  items: T[];
}

export interface ObjectJsonApiError extends JsonApiError {
  code: number;
  status: string;
  message?: string;
  reason: string;
  details: {
    name: string;
    kind: string;
  };
}

export interface ObjectJsonApiQuery {
  watch?: any;
  resourceVersion?: string;
  timeoutSeconds?: number;
  limit?: number; // doesn't work with ?watch
  continue?: string; // might be used with ?limit from second request
}
