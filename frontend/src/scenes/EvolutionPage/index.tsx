import './index.scss';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Select, Typography, Row, Col } from 'antd';
import { Stores } from '../../stores/storeIdentifier';
import TapiraApiSpecificationsStore from '../../stores/tapiraApiSpecificationsStore';
import TapiraApiComparisonStore from '../../stores/tapiraApiComparisonStore';
import ApiDiffView from '../../components/PartialComponents/ApiDiffView';

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

const EvolutionPage = ({
  tapiraApiSpecificationsStore,
  tapiraApiComparisonStore,
}: {
  [Stores.TapiraApiSpecificationsStore]?: TapiraApiSpecificationsStore;
  [Stores.TapiraApiComparisonStore]?: TapiraApiComparisonStore;
}) => {
  const { serviceName } = useParams();
  const [versionListA, setVersionListA] = useState<IVersionOption[]>();
  const [versionListB, setVersionListB] = useState<IVersionOption[]>();
  const [selectedA, setSelectedA] = useState<string>();
  const [selectedB, setSelectedB] = useState<string>();

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
    createCallbackForSpecVersions();
    createCallbackForEvolution();
  }, [createCallbackForEvolution, createCallbackForSpecVersions]);

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

  return (
    <React.Fragment>
      <Title>{serviceName?.toUpperCase()} &#62; Evolution</Title>
      <div className="content specs-evolution">
        <Row>
          <Col span={8} offset={2}>
            <Title level={4}>Version B</Title>
            <Select
              placeholder="select a version"
              style={{ width: 180 }}
              allowClear
              onChange={onChangeListA}
            >
              {optionsListA}
            </Select>
          </Col>
          <Col span={8} offset={4}>
            <Title level={4}>Version B</Title>
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
        {!!tapiraApiComparisonStore?.evolutionResponse && (
          <div className="specs-evolution__diffs">
            <ApiDiffView {...tapiraApiComparisonStore?.evolutionResponse} />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default inject(
  Stores.TapiraApiSpecificationsStore,
  Stores.TapiraApiComparisonStore
)(observer(EvolutionPage));
