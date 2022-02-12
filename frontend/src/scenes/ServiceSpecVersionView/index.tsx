import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from 'antd';
import { Stores } from '../../stores/storeIdentifier';
import TapiraApiSpecificationsStore from '../../stores/tapiraApiSpecificationsStore';
import { inject, observer } from 'mobx-react';

const { Title } = Typography;

const ServiceSpecVersionView = (props) => {

  const { tapiraApiSpecificationsStore }: 
  { [Stores.TapiraApiSpecificationsStore]: TapiraApiSpecificationsStore } = 
  props;

  const params = useParams();
  const servName = params.serviceName
  const servVersion = params.version

  const [api_specs, setServices] = useState<Array<string>>(new Array<string>());

  const getSpecs = useCallback(async () => {
    await tapiraApiSpecificationsStore.getSpecificationsForServiceVersion(servName as string, servVersion as string);
    setServices(tapiraApiSpecificationsStore.serviceSpecificationsVersion);
  }, [servName, servVersion, tapiraApiSpecificationsStore]);
  

  useEffect(() => {
    getSpecs();
  }, [getSpecs]);

  //useEffect(() => {
    //console.log('%c checking params', 'color: yellow', params);
  //}, [params]);

  const spec = api_specs.map((api_spec: string) => (
    {api_spec}
  ));
  

  return <React.Fragment>
    <Title>Service {params.serviceName} Version {params.version}</Title>
    <div className="content service-version"><pre>
      {JSON.stringify(spec, null, 2)}
      </pre></div>
  </React.Fragment>;
};

//export default ServiceSpecVersionView;
export default inject(Stores.TapiraApiSpecificationsStore)(
  observer(ServiceSpecVersionView)
);