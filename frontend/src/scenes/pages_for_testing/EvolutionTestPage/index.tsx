import './index.scss';

import React, { useEffect, useCallback, useState } from 'react';
import { inject, observer } from 'mobx-react';
import {Table, Typography, List, Row, Col, Select} from 'antd';
import { Stores } from '../../../stores/storeIdentifier';
import TestingStore from '../../../stores/testingStore';
import {
  EndpointTypes,
  EvolutionResponse,
  PDIndicatorInfo,
  RequestInfo,
} from '../../../services/tapiraApiComparisonService/comparison-api-dtos';
import {useParams} from "react-router-dom";
import TapiraApiSpecificationsStore from "@src/stores/tapiraApiSpecificationsStore";
import TapiraApiComparisonStore from "@src/stores/tapiraApiComparisonStore";

const { Title } = Typography;
const { Option } = Select;

interface IVersionOption {
    value: string;
    disabled?: boolean;
}

function createVersionOptions(
    versionList: string[],
    selectVersion?: string
): IVersionOption[] {
    return versionList.map(
        (version: string) =>
            ({
                value: version,
                disabled: version === selectVersion,
            } as IVersionOption)
    );
}


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
          {data[key] === null && <span className="value-red">{data[key]}</span>}
        </List.Item>
      )}
    />
  );
};

const EvolutionTestPage = ({
  testingStore,
  tapiraApiSpecificationsStore,
  tapiraApiComparisonStore
}: {
    [Stores.TapiraApiSpecificationsStore]?: TapiraApiSpecificationsStore;
    [Stores.TapiraApiComparisonStore]?: TapiraApiComparisonStore;
  [Stores.TestingStore]: TestingStore;
}) => {
  const [evolution, setEvolution] = useState<EvolutionResponse>();
  const { serviceName } = useParams();
  const [versionListA, setVersionListA] = useState<IVersionOption[]>();
  const [versionListB, setVersionListB] = useState<IVersionOption[]>();
  const [selectedA, setSelectedA] = useState<string>();
  const [selectedB, setSelectedB] = useState<string>();
  const data: { [key: string]: any }[] = [];
  const columns: any[] = [];

  const getEvolution = useCallback(async () => {
    await testingStore.getEvolutionForTest();
    if (testingStore.evolutionResponse !== undefined) {
      setEvolution(testingStore.evolutionResponse);
    }
  }, [testingStore]);

  const createCallbackForSpecVersions = useCallback(async () => {
        if (!!serviceName) {
            await tapiraApiSpecificationsStore?.getSpecVersionsForService(
                serviceName
            );
            if (tapiraApiSpecificationsStore?.versionTags.length) {
                setVersionListA(
                    createVersionOptions(tapiraApiSpecificationsStore?.versionTags)
                );
                setVersionListB(
                    createVersionOptions(tapiraApiSpecificationsStore?.versionTags)
                );
            }
        }
  }, [serviceName, tapiraApiSpecificationsStore]);

  const createCallbackForEvolution = useCallback(async () => {
        if (selectedA && selectedB && serviceName) {
            await tapiraApiComparisonStore?.getEvolutionForService(
                serviceName,
                selectedA,
                selectedB
            );
        }
  }, [selectedA, selectedB, serviceName, tapiraApiComparisonStore]);

    useEffect(() => {
        getEvolution();

        if (versionListA === undefined) {
            createCallbackForSpecVersions();
        }
        createCallbackForEvolution();
    }, [getEvolution, createCallbackForEvolution, createCallbackForSpecVersions, versionListA]);

    const onChangeListA = (value: string) => {
        if (tapiraApiSpecificationsStore?.versionTags) {
            setVersionListB(
                createVersionOptions(tapiraApiSpecificationsStore?.versionTags, value)
            );
        }
        setSelectedA(value);
    };

    const onChangeListB = (value: string) => {
        if (tapiraApiSpecificationsStore?.versionTags) {
            setVersionListA(
                createVersionOptions(tapiraApiSpecificationsStore.versionTags, value)
            );
        }
        setSelectedB(value);
    };

    const optionsListA = versionListA?.map((option: IVersionOption) => (
        <Option key={`${option.value}_A`} {...option}>
            {option.value}
        </Option>
    ));

    const optionsListB = versionListB?.map((option: IVersionOption) => (
        <Option key={`${option.value}_B`} {...option}>
            {option.value}
        </Option>
    ));

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
                        title: 'Old',
                        align: 'center',
                        dataIndex: `${endpoint}.${endpointType}.${requestInfoKey}.${parameter}.old`,
                        key: `${endpoint}.${endpointType}.${requestInfoKey}.${parameter}.old`,
                        render: (data: any) => renderColumnData(data, 'old'),
                    },
                  {
                    title: 'New',
                    align: 'center',
                    dataIndex: `${endpoint}.${endpointType}.${requestInfoKey}.${parameter}.new`,
                    key: `${endpoint}.${endpointType}.${requestInfoKey}.${parameter}.new`,
                    render: (data: any) => renderColumnData(data, 'new'),
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
        <div className="content specs-evolution">
            <Row>
                <Col style={{textAlign: 'center'}} span={8} offset={2}>
                    <Title level={4}>Version 1</Title>
                    <Select
                        placeholder="select a version"
                        style={{ width: 180 }}
                        allowClear
                        onChange={onChangeListA}
                    >
                        {optionsListA}
                    </Select>
                </Col>
                <Col style={{textAlign: 'center'}} span={8} offset={4}>
                    <Title level={4}>Version 2</Title>
                    <Select
                        placeholder="select version to compare"
                        style={{ width: 180 }}
                        allowClear
                        onChange={onChangeListB}
                    >
                        {optionsListB}
                    </Select>
                </Col>
            </Row>
            <div className="specs-evolution__diffs">
                {/* <ApiDiffView {...tapiraApiComparisonStore?.evolutionResponse} /> */}
            </div>
        </div>
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

export default inject(Stores.TestingStore,
    Stores.TapiraApiSpecificationsStore,
    Stores.TapiraApiComparisonStore)(observer(EvolutionTestPage));
