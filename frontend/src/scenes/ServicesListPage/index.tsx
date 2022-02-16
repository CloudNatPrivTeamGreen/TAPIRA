import './index.scss';

import React, { useEffect, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Collapse, Typography, List, Alert } from 'antd';
import PanelCallToActions from '../../components/PartialComponents/PanelCallToActions';
import { Stores } from '../../stores/storeIdentifier';
import TapiraApiSpecificationsStore from '../../stores/tapiraApiSpecificationsStore';
import {
  RoutePaths,
  RoutingParameters,
} from '../../components/Router/router.config';
import VersionUploadContext from '../../contexts/version-upload-context';
import { Utils } from '../../utils/utils';

const { Title } = Typography;
const { Panel } = Collapse;

const TapiraServicesList = (props: any) => {
  const {
    tapiraApiSpecificationsStore,
  }: { [Stores.TapiraApiSpecificationsStore]: TapiraApiSpecificationsStore } =
    props;
  const [services, setServices] = useState<Array<string>>(new Array<string>());
  const [versionTags, setVersionTags] = useState<Array<string> | null>(null);
  const [openPanelIndex, setOpenPanelIndex] = useState<number>();

  const getApiClaritySpecs = useCallback(async () => {
    await tapiraApiSpecificationsStore.getApiclaritySpecs();
    setServices(tapiraApiSpecificationsStore.apiClaritySpecs);
  }, [tapiraApiSpecificationsStore]);

  const getSpecVersion = useCallback(
    async (serviceName: string) => {
      await tapiraApiSpecificationsStore.getSpecVersionsForService(serviceName);
      if (tapiraApiSpecificationsStore.versionTags.length > 0)
        setVersionTags(tapiraApiSpecificationsStore.versionTags);
      else setVersionTags(null);
    },
    [tapiraApiSpecificationsStore]
  );

  useEffect(() => {
    getApiClaritySpecs();
  }, [getApiClaritySpecs]);

  const onCollapseCallback = (key: string | string[]) => {
    if (typeof key === 'object') {
      return;
    }
    const index = parseInt(key);
    setOpenPanelIndex(index);
    getSpecVersion(services[index]);
  };

  const onNewVersionUpload = () => {
    if (openPanelIndex !== undefined) getSpecVersion(services[openPanelIndex]);
  };

  const panels = services.map((service: string, index: number) => (
    <Panel
      className="collapse__panel"
      header={
        <span className="header--font-20">
          {Utils.capitalizePropertyName(service)}
        </span>
      }
      extra={<PanelCallToActions serviceName={service} />}
      key={index}
    >
      {openPanelIndex === index && versionTags?.length && (
        <List
          size="small"
          bordered
          dataSource={versionTags}
          renderItem={(version) => (
            <List.Item>
              <Link
                to={RoutePaths.Service.replace(
                  RoutingParameters.ServiceName,
                  service
                ).replace(RoutingParameters.Version, version)}
              >
                <strong>Spec version:</strong> {version}
              </Link>
            </List.Item>
          )}
        />
      )}
      {versionTags === null && (
        <Alert
          message="No version available for this service"
          type="warning"
          showIcon
        />
      )}
    </Panel>
  ));

  return (
    <React.Fragment>
      <Title>Services</Title>
      <div className="content services-list">
        <VersionUploadContext.Provider value={{ onNewVersionUpload }}>
          <Collapse
            accordion
            className="services-list__collapse"
            onChange={onCollapseCallback}
          >
            {panels}
          </Collapse>
        </VersionUploadContext.Provider>
      </div>
    </React.Fragment>
  );
};

export default inject(Stores.TapiraApiSpecificationsStore)(
  observer(TapiraServicesList)
);
