import React, { useEffect, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { List } from "antd";
import { inject, observer } from "mobx-react";
import { Stores } from "../../stores/storeIdentifier";
import TapiraApiStore from "../../stores/tapiraApiStore";
import {
  RoutePaths,
  RoutingParameters,
} from "../../components/Router/router.config";

const TapiraServicesList = (props: any) => {
  const { tapiraApiStore }: { [Stores.TapiraApiStore]: TapiraApiStore } = props;
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState(new Array<string>());

  const getApiClaritySpecs = useCallback(async () => {
    setLoading(true);
    await tapiraApiStore.getApiclaritySpecs();
    setServices(tapiraApiStore.apiClaritySpecs);
    setLoading(false);
  }, [tapiraApiStore]);

  useEffect(() => {
    getApiClaritySpecs();
  }, [getApiClaritySpecs]);

  return (
    <React.Fragment>
      <List
        loading={loading}
        itemLayout="horizontal"
        dataSource={services}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Link
                to={RoutePaths.Service.toString().replace(
                  `${RoutingParameters.ServiceName.toString()}`,
                  item
                )}
              >
                <span>Show API Specs</span>
              </Link>,
            ]}
          >
            <List.Item.Meta title={item} />
          </List.Item>
        )}
      />
    </React.Fragment>
  );
};

export default inject(Stores.TapiraApiStore)(observer(TapiraServicesList));
