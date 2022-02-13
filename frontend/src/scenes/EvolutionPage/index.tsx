import './index.scss';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Select, Typography, Row, Col } from 'antd';
import { Stores } from '../../stores/storeIdentifier';
import TapiraApiSpecificationsStore from '../../stores/tapiraApiSpecificationsStore';

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
}: {
  [Stores.TapiraApiSpecificationsStore]?: TapiraApiSpecificationsStore;
}) => {
  const { serviceName } = useParams();
  const [versionListA, setVersionListA] = useState<IVersionOption[]>();
  const [versionListB, setVersionListB] = useState<IVersionOption[]>();

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

  useEffect(() => {
    createCallbackForSpecVersions();
  }, [createCallbackForSpecVersions]);

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
            <Select style={{ width: 180 }} allowClear>
              {optionsListA}
            </Select>
          </Col>
          <Col span={8} offset={4}>
            <Title level={4}>Version B</Title>
            <Select style={{ width: 180 }} allowClear>
              {optionsListB}
            </Select>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default inject(Stores.TapiraApiSpecificationsStore)(
  observer(EvolutionPage)
);
