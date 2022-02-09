import React, { useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { Stores } from "../../stores/storeIdentifier";
import TapiraApiStore from "../../stores/tapiraApiStore";
import { RoutingParameters } from "../../components/Router/router.config";

const TapiraService = (props: any) => {
  const { tapiraApiStore }: { [Stores.TapiraApiStore]: TapiraApiStore } = props;

  const { serviceName } = useParams();

  const getSpecifications = useCallback(async () => {
    await tapiraApiStore.getSpecificationsForService(serviceName as string);
    console.log(
      "in Tapira Service component: ",
      tapiraApiStore.serviceSpecifications
    );
  }, []);

  useEffect(() => {
    getSpecifications();
  }, []);

  return (
    <>
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
    </>
  );
};

export default inject(Stores.TapiraApiStore)(observer(TapiraService));
