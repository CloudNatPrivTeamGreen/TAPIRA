import './index.scss';

import React, { useEffect, useCallback, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Typography, Collapse, List, Button, message } from 'antd';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _ from 'lodash';
import { Stores } from '../../stores/storeIdentifier';
import TestingStore from '../../stores/tapiraApiReportsStore';
import {
  ReportResponse,
  Report,
  IServiceVersion,
  RecordingStatus,
  RecordStatusEnumMap,
} from '../../services/tapiraApiReportsService/reports-api';
import { Utils } from '../../utils/utils';
import ListIterator from '../../components/PartialComponents/ListIterator';

const { Title } = Typography;
const { Panel } = Collapse;

const InnerReportCollapse = ({
  report,
  services,
}: {
  report: Report;
  services: IServiceVersion;
}) => {
  const panels = [
    Utils.nameof<ReportResponse>('report'),
    Utils.nameof<ReportResponse>('services'),
  ].map((key: string, index: number) => (
    <Panel header={Utils.capitalizePropertyName(key)} key={index}>
      {key === Utils.nameof<ReportResponse>('services') && (
        <List
          size="small"
          bordered
          dataSource={Object.keys(services)}
          renderItem={(service) => (
            <List.Item>
              {Utils.capitalizePropertyName(service)}: {services[service]}
            </List.Item>
          )}
        />
      )}
      {key === Utils.nameof<ReportResponse>('report') && (
        <Collapse>
          {Object.keys(report).map((key: string, index: number) => {
            return (
              <Panel key={index} header={Utils.capitalizePropertyName(key)}>
                <ListIterator propName={key} obj={report[key]} />
              </Panel>
            );
          })}
        </Collapse>
      )}
    </Panel>
  ));

  return <Collapse>{panels}</Collapse>;
};

const ReportsTestPage = ({
  tapiraApiReportsStore,
}: {
  [Stores.TapiraApiReportsStore]: TestingStore;
}) => {
  const [reports, setReports] = useState<ReportResponse[]>();
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const getReports = useCallback(async () => {
    await tapiraApiReportsStore.fetchReports();
    if (tapiraApiReportsStore.reportsResponse)
      setReports(tapiraApiReportsStore.reportsResponse);
  }, [tapiraApiReportsStore]);

  useEffect(() => {
    getReports();
  }, [getReports]);

  const onTriggerReports = async () => {
    setIsGenerating(true);
    await tapiraApiReportsStore.triggerOrStopRecording(RecordingStatus.ON);
    if (tapiraApiReportsStore.triggerReportsResponse === RecordingStatus.ON) {
      message.success('Reports are being generated');
      return;
    }

    message.error('An error occurred while generating reports');
    setIsGenerating(false);
    return;
  };

  const stopGenerating = async () => {
    setIsGenerating(false);
    await tapiraApiReportsStore.triggerOrStopRecording(RecordingStatus.OFF);
    if (tapiraApiReportsStore.triggerReportsResponse === RecordingStatus.OFF) {
      message.success(
        'Generating reports is successfully stopped. Fetching new reports'
      );
      getReports();
      return;
    }

    message.error('An error occurred while stopping the generation of reports');
    return;
  };

  const panels = reports?.map((report: ReportResponse, index: number) => (
    <Panel
      className="collapse__panel"
      header={
        <React.Fragment>
          {report.end_timestamp && (
            <span className="header--font-18 mr-30">
              <strong>End timestamp</strong>:{' '}
              {report.end_timestamp.toLocaleString()}
            </span>
          )}
          {report.start_timestamp && (
            <span className="header--font-18">
              <strong>Start timestamp</strong>:{' '}
              {report.start_timestamp.toLocaleString()}
            </span>
          )}
        </React.Fragment>
      }
      key={index}
    >
      <InnerReportCollapse {...report} />
    </Panel>
  ));

  return (
    <React.Fragment>
      <Title level={1}>Reports</Title>
      <div className="content reports-page">
        <div className="reports-cta">
          <Button
            type="primary"
            size="large"
            onClick={onTriggerReports}
            loading={isGenerating}
          >
            Trigger Reports
          </Button>
          <Button
            type="primary"
            size="large"
            danger
            disabled={!isGenerating}
            onClick={stopGenerating}
          >
            Stop Generating Reports
          </Button>
        </div>
        <Collapse>{panels}</Collapse>
      </div>
    </React.Fragment>
  );
};

export default inject(Stores.TapiraApiReportsStore)(observer(ReportsTestPage));
