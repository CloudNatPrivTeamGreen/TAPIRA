import './index.scss';

import React, { useEffect, useCallback, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Collapse, Typography, Button } from 'antd';
import UploadJsonModal from '../../components/PartialComponents/UploadJsonModal';
import { Stores } from '../../stores/storeIdentifier';
import TapiraApiSpecificationsStore from '../../stores/tapiraApiSpecificationsStore';

const { Title } = Typography;
const { Panel } = Collapse;

const PanelCallToActions = ({ serviceName }) => {
  const onClickPreventDefault = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <React.Fragment>
      <div
        className="collapse__panel__cta-container"
        onClick={(event) => onClickPreventDefault(event)}
      >
        <UploadJsonModal serviceName={serviceName} />
        <Button>Compare</Button>
        <Button>Evolution</Button>
      </div>
    </React.Fragment>
  );
};

const TapiraServicesList = (props: any) => {
  const {
    tapiraApiSpecificationsStore,
  }: { [Stores.TapiraApiSpecificationsStore]: TapiraApiSpecificationsStore } =
    props;
  const [services, setServices] = useState<Array<string>>(new Array<string>());
  const [openPanelIndex, setOpenPanelIndex] = useState<string | null>(null);

  const getApiClaritySpecs = useCallback(async () => {
    await tapiraApiSpecificationsStore.getApiclaritySpecs();
    setServices(tapiraApiSpecificationsStore.apiClaritySpecs);
  }, [tapiraApiSpecificationsStore]);

  useEffect(() => {
    getApiClaritySpecs();
  }, [getApiClaritySpecs]);

  const onCollapseCallback = (key: string | string[]) => {
    if (typeof key === 'object') {
      return;
    }
    const index = parseInt(key);
    setOpenPanelIndex(services[index]);
  };

  const panels = services.map((service: string, index: number) => (
    <Panel
      className="collapse__panel"
      header={<span className="header--font-20">{service}</span>}
      extra={<PanelCallToActions serviceName={service} />}
      key={index}
    >
      <span>{service}</span>
    </Panel>
  ));

  return (
    <React.Fragment>
      <Title>Services</Title>
      <div className="content services-list">
        <Collapse
          className="services-list__collapse"
          onChange={onCollapseCallback}
        >
          {panels}
        </Collapse>
      </div>
    </React.Fragment>
  );
};

export default inject(Stores.TapiraApiSpecificationsStore)(
  observer(TapiraServicesList)
);
