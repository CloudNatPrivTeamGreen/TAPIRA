export enum RecordingStatus {
  ON = 'ON',
  OFF = 'OFF',
}

export interface Report {
  purposes: any;
  utilizers: any;
  profiling: any;
}

export interface IServiceVersion {
  [service: string]: string;
}
export interface ReportResponse {
  timestamp: Date;
  services: IServiceVersion;
  report: Report;
}
