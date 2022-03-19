import './index.scss';

import React, { useEffect, useCallback, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Typography, Row, Col, Select, Button, Collapse } from 'antd';
import { Stores } from '../../stores/storeIdentifier';
import { Evolution } from '../../services/tapiraApiComparisonService/comparison-api';
import { useParams } from 'react-router-dom';
import TapiraApiSpecificationsStore from '../../stores/tapiraApiSpecificationsStore';
import TapiraApiComparisonStore from '../../stores/tapiraApiComparisonStore';
import CollapseForSchemas from '../../components/PartialComponents/CollapseForSchemas';
import GlobalChangesList from '../../components/PartialComponents/GlobalChangesList';
import EvolutionPaths from '../../components/PartialComponents/EvolutionPaths';
import { Utils } from '../../utils/utils';

const { Title } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

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

const EvolutionTestPage = ({
  tapiraApiSpecificationsStore,
  tapiraApiComparisonStore,
}: {
  [Stores.TapiraApiSpecificationsStore]: TapiraApiSpecificationsStore;
  [Stores.TapiraApiComparisonStore]: TapiraApiComparisonStore;
}) => {
  const [evolution, setEvolution] = useState<Evolution>();
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

      setEvolution(tapiraApiComparisonStore.evolution);
    }
  }, [selectedA, selectedB, serviceName, tapiraApiComparisonStore]);

  useEffect(() => {
    if (versionListA === undefined) {
      createCallbackForSpecVersions();
    }
  }, [createCallbackForEvolution, createCallbackForSpecVersions, versionListA]);

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
      <Title level={1}>
        Evolution - {Utils.capitalizePropertyName(serviceName ?? '')} service
      </Title>
      <div className="content evolution-page">
        <div className="evolution-page__ctas">
          <Row>
            <Col style={{ textAlign: 'center' }} span={8} offset={2}>
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
            <Col span={2} offset={1}>
              <Button
                className="fetch-evolution-button"
                title="Fetch Evolution"
                type="primary"
                onClick={createCallbackForEvolution}
                disabled={!(selectedA && selectedB)}
              >
                Fetch Evolution
              </Button>
            </Col>
            <Col style={{ textAlign: 'center' }} span={8} offset={1}>
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
        </div>
        <div className="evolution-page__collapse-container">
          <Collapse accordion>
            <Panel header="Schemas" key="1" className="schemas">
              {!!evolution?.schemas && (
                <CollapseForSchemas schemas={evolution.schemas} />
              )}
            </Panel>
            <Panel header="Paths" key="2" className="paths">
              {!!evolution?.paths && (
                <EvolutionPaths pathsInfo={evolution?.paths} />
              )}
            </Panel>
            <Panel header="Global" key="3" className="global-changes">
              {!!evolution?.global_changes && (
                <GlobalChangesList globalChanges={evolution?.global_changes} />
              )}
            </Panel>
          </Collapse>
        </div>
      </div>
    </React.Fragment>
  );
};

export default inject(
  Stores.TapiraApiSpecificationsStore,
  Stores.TapiraApiComparisonStore
)(observer(EvolutionTestPage));
