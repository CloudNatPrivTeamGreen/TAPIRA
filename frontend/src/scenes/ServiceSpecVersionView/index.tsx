import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from 'antd';
import { Stores } from '../../stores/storeIdentifier';
import TapiraApiSpecificationsStore from '../../stores/tapiraApiSpecificationsStore';
import { inject, observer } from 'mobx-react';

const { Title } = Typography;

const ServiceSpecVersionView = (props) => {
  const {
    tapiraApiSpecificationsStore,
  }: { [Stores.TapiraApiSpecificationsStore]: TapiraApiSpecificationsStore } =
    props;

  const { serviceName, version } = useParams();

  const [serviceSpecifications, setServiceSpecifications] = useState<
    Array<string>
  >(new Array<string>());

  const getSpecs = useCallback(async () => {
    await tapiraApiSpecificationsStore.getSpecificationsForService(
      serviceName as string,
      version as string
    );
    setServiceSpecifications(
      tapiraApiSpecificationsStore.serviceSpecifications
    );
  }, [serviceName, tapiraApiSpecificationsStore, version]);

  useEffect(() => {
    getSpecs();
  }, [getSpecs]);

  return (
    <React.Fragment>
      <Title>
        {serviceName} {version}
      </Title>
      <div className="content service-version">
        <pre>{JSON.stringify(serviceSpecifications, null, 2)}</pre>
      </div>
    </React.Fragment>
  );
};

export default inject(Stores.TapiraApiSpecificationsStore)(
  observer(ServiceSpecVersionView)
);
