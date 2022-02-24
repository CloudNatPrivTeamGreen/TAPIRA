import React, { useEffect, useCallback, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Typography, Collapse, List, Tag } from 'antd';
import * as _ from 'lodash';
import { Stores } from '../../../stores/storeIdentifier';
import TestingStore from '../../../stores/testingStore';
import {
  ReportResponse,
  Report,
  IServiceVersion,
} from '../../../services/tapiraApiComparisonService/comparison-api-dtos';
import { Utils } from '../../../utils/utils';
import ListIterator from '../../../components/PartialComponents/ListIterator';

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
  testingStore,
}: {
  [Stores.TestingStore]: TestingStore;
}) => {
  const [reports, setReports] = useState<ReportResponse[]>();

  const getReports = useCallback(async () => {
    await testingStore.getReportsForTesting();
    if (testingStore.reportsResponse) setReports(testingStore.reportsResponse);
  }, [testingStore]);

  useEffect(() => {
    getReports();
  }, [getReports]);

  const panels = reports?.map((report: ReportResponse, index: number) => (
    <Panel
      className="collapse__panel"
      header={
        <span className="header--font-20">
          {report.timestamp.toLocaleString()}
        </span>
      }
      key={index}
    >
      <InnerReportCollapse {...report} />
    </Panel>
  ));

  return (
    <React.Fragment>
      <Title level={1}>Reports</Title>
      <div className="content reports-test-page">
        <Collapse>{panels}</Collapse>
      </div>
    </React.Fragment>
  );
};

export default inject(Stores.TestingStore)(observer(ReportsTestPage));
