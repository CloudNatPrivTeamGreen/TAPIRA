import React, { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Typography } from 'antd';
import { Stores } from '../../stores/storeIdentifier';
import TapiraApiSpecificationsStore from '../../stores/tapiraApiSpecificationsStore';

// let jsonDiff = require('json-diff');

const { Title } = Typography;

const CompareSpecsPage = ({
  tapiraApiSpecificationsStore,
}: {
  [Stores.TapiraApiSpecificationsStore]: TapiraApiSpecificationsStore;
}) => {
  const { serviceName } = useParams();

  const getCurrentVersionSpecCallback = useCallback(async () => {
    if (!serviceName) {
      throw Error('No serviceName provided in the route');
    }

    await tapiraApiSpecificationsStore.getCurrentVersionSpecForService(
      serviceName
    );
  }, [serviceName, tapiraApiSpecificationsStore]);

  useEffect(() => {
    getCurrentVersionSpecCallback();

    // const differences = jsonDiff.diffString(
    //   tapiraApiSpecificationsStore.currentServiceSpecificationsVersion,
    //   tapiraApiSpecificationsStore.specsToCompare
    // );
    // console.log('in useEffect: ', differences);
  }, [
    getCurrentVersionSpecCallback,
    tapiraApiSpecificationsStore.currentServiceSpecificationsVersion,
    tapiraApiSpecificationsStore.specsToCompare,
  ]);

  return (
    <React.Fragment>
      <Title>{serviceName?.toUpperCase()} &#62; Compare</Title>
      <div className="content compare-specs"></div>
    </React.Fragment>
  );
};

export default inject(Stores.TapiraApiSpecificationsStore)(
  observer(CompareSpecsPage)
);
