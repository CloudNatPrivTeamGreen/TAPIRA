import './index.scss';

import React, { useEffect, useCallback, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Table, Typography, List } from 'antd';
import { Stores } from '../../../stores/storeIdentifier';
import TestingStore from '../../../stores/testingStore';
import {
  EndpointTypes,
  EvolutionResponse,
  PDIndicatorInfo,
  RequestInfo,
} from '../../../services/tapiraApiComparisonService/comparison-api-dtos';

const { Title } = Typography;

const renderColumnData = (data: any, uniqueIdentifier: string) => {
  return (
    <List
      key={uniqueIdentifier}
      size="small"
      bordered
      dataSource={Object.keys(data)}
      renderItem={(key, index) => (
        <List.Item key={key + index + uniqueIdentifier}>
          <strong>{key}: </strong>{' '}
          {data[key] !== null && (
            <span className="value-green">{data[key]}</span>
          )}
          {data[key] === null && <span className="value-red">N/A</span>}
        </List.Item>
      )}
    />
  );
};

const EvolutionTestPage = ({
  testingStore,
}: {
  [Stores.TestingStore]: TestingStore;
}) => {
  const [evolution, setEvolution] = useState<EvolutionResponse>();

  const getEvolution = useCallback(async () => {
    await testingStore.getEvolutionForTest();
    if (testingStore.evolutionResponse !== undefined) {
      setEvolution(testingStore.evolutionResponse);
    }
  }, [testingStore]);

  useEffect(() => {
    getEvolution();
  }, [getEvolution]);

  const data: { [key: string]: any }[] = [];
  const columns: any[] = [];

  if (evolution) {
    Object.keys(evolution!).forEach((endpoint: string) => {
      const endpointType: string | undefined = Object.keys(
        evolution![endpoint]
      ).find((key) => key in EndpointTypes);
      const pdIndicatorInfo: PDIndicatorInfo | undefined =
        evolution![endpoint][endpointType!];
      const endpointObj: { [key: string]: any } = {};
      columns.push(endpointObj);
      endpointObj.title = (
        <Title level={4}>
          {endpointType}: {endpoint}
        </Title>
      );
      endpointObj.children = [];
      if (pdIndicatorInfo)
        Object.keys(pdIndicatorInfo)
          .filter((key: string) => key in RequestInfo)
          .forEach((requestInfoKey: string) => {
            const requestInfoObj: { [key: string]: any } = {};
            endpointObj.children.push(requestInfoObj);
            requestInfoObj.title = <Title level={5}>{requestInfoKey}</Title>;
            requestInfoObj.align = 'center';
            requestInfoObj.children = [];
            Object.keys(pdIndicatorInfo[requestInfoKey])
              .filter((key) => key !== 'is_removed')
              .forEach((parameter: string) => {
                const parameterObj: { [key: string]: any } = {};
                requestInfoObj.children.push(parameterObj);
                parameterObj.title = <Title level={5}>{parameter}</Title>;
                parameterObj.align = 'center';
                parameterObj.children = [
                  {
                    title: 'New',
                    align: 'center',
                    dataIndex: `${endpoint}.${endpointType}.${requestInfoKey}.${parameter}.new`,
                    key: `${endpoint}.${endpointType}.${requestInfoKey}.${parameter}.new`,
                    render: (data: any) => renderColumnData(data, 'new'),
                  },
                  {
                    title: 'Old',
                    align: 'center',
                    dataIndex: `${endpoint}.${endpointType}.${requestInfoKey}.${parameter}.old`,
                    key: `${endpoint}.${endpointType}.${requestInfoKey}.${parameter}.old`,
                    render: (data: any) => renderColumnData(data, 'old'),
                  },
                ];
                data.push({
                  [`${endpoint}.${endpointType}.${requestInfoKey}.${parameter}.new`]:
                    pdIndicatorInfo[requestInfoKey][parameter]['new'],
                  [`${endpoint}.${endpointType}.${requestInfoKey}.${parameter}.old`]:
                    pdIndicatorInfo[requestInfoKey][parameter]['old'],
                });
              });
          });
    });
  }

  return (
    <React.Fragment>
      <Title level={1}>Evolution</Title>
      <div className="content evolution-test-page">
        <Table
          className="evolution-test-page__table"
          columns={columns}
          dataSource={data}
          bordered
          size="middle"
          pagination={false}
        />
      </div>
    </React.Fragment>
  );
};

export default inject(Stores.TestingStore)(observer(EvolutionTestPage));
