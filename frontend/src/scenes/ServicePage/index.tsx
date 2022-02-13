import React, { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Stores } from '../../stores/storeIdentifier';
import TapiraApiSpecificationsStore from '../../stores/tapiraApiSpecificationsStore';

const TapiraService = (props: any) => {
  const {
    tapiraApiSpecificationsStore,
  }: { [Stores.TapiraApiSpecificationsStore]: TapiraApiSpecificationsStore } =
    props;

  const { serviceName } = useParams();

  const getSpecifications = useCallback(async () => {
    await tapiraApiSpecificationsStore.getCurrentVersionSpecForService(
      serviceName as string
    );
  }, [serviceName, tapiraApiSpecificationsStore]);

  useEffect(() => {
    getSpecifications();
  }, [getSpecifications]);

  return (
    <React.Fragment>
      <h1>Is the Tapira Service</h1>
      <ul>
        <li>An item 1</li>
        <li>An Item 2</li>
        <li>An item 1</li>
        <li>An Item 2</li>
        <li>An item 1</li>
        <li>An Item 2</li>

        <li>An item 1</li>
        <li>An Item 2</li>
        <li>An item 1</li>
        <li>An Item 2</li>

        <li>An item 1</li>
        <li>An Item 2</li>
        <li>An item 1</li>
        <li>An Item 2</li>

        <li>An item 1</li>
        <li>An Item 2</li>
      </ul>
    </React.Fragment>
  );
};

export default inject(Stores.TapiraApiSpecificationsStore)(
  observer(TapiraService)
);
