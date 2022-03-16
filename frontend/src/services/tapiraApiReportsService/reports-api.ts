export enum RecordingStatus {
  ON = 'ON',
  OFF = 'OFF',
}

export const RecordStatusEnumMap = new Map<string, RecordingStatus>()
  .set('RecordStatusEnum.ON', RecordingStatus.ON)
  .set('RecordStatusEnum.OFF', RecordingStatus.OFF);

export interface Report {
  purposes: any;
  utilizers: any;
  profiling: any;
}

export interface IServiceVersion {
  [service: string]: string;
}
export interface ReportResponse {
  end_timestamp: Date;
  start_timestamp: Date;
  services: IServiceVersion;
  report: Report;
}
