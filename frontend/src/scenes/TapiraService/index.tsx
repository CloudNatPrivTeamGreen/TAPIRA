import React, { useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { Stores } from "../../stores/storeIdentifier";
import TapiraApiStore from "../../stores/tapiraApiStore";

const TapiraService = (props: any) => {
  const { tapiraApiStore }: { [Stores.TapiraApiStore]: TapiraApiStore } = props;

  const { serviceName } = useParams();

  const getSpecifications = useCallback(async () => {
    await tapiraApiStore.getSpecificationsForService(serviceName as string);
  }, [serviceName, tapiraApiStore]);

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

export default inject(Stores.TapiraApiStore)(observer(TapiraService));
