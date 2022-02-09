import React, { useEffect, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Collapse, Typography, Button } from "antd";
import { inject, observer } from "mobx-react";
import { Stores } from "../../stores/storeIdentifier";
import TapiraApiStore from "../../stores/tapiraApiStore";
import {
  RoutePaths,
  RoutingParameters,
} from "../../components/Router/router.config";

const { Title } = Typography;
const { Panel } = Collapse;

const PanelHeader = ({ serviceName }) => {
  return (
    <React.Fragment>
      <Button style={{ marginRight: "10px" }}>Upload</Button>
      <Button style={{ marginRight: "10px" }}>Compare</Button>
      <Button style={{ marginRight: "10px" }}>Evolution</Button>
    </React.Fragment>
  );
};

const TapiraServicesList = (props: any) => {
  const { tapiraApiStore }: { [Stores.TapiraApiStore]: TapiraApiStore } = props;
  const [services, setServices] = useState<Array<string>>(new Array<string>());
  const [openPanelIndex, setOpenPanelIndex] = useState<string | null>(null);

  const getApiClaritySpecs = useCallback(async () => {
    await tapiraApiStore.getApiclaritySpecs();
    setServices(tapiraApiStore.apiClaritySpecs);
  }, [tapiraApiStore]);

  useEffect(() => {
    getApiClaritySpecs();
  }, [getApiClaritySpecs]);

  const onCollapseCallback = (key: string | string[]) => {
    if (typeof key === "object") {
      return;
    }
    const index = parseInt(key);
    setOpenPanelIndex(services[index]);
  };

  const panels = services.map((service: string, index: number) => (
    <Panel
      header={<span style={{ fontSize: "20px" }}>{service}</span>}
      extra={<PanelHeader serviceName={service} />}
      key={index}
    >
      <p>service</p>
    </Panel>
  ));

  return (
    <React.Fragment>
      <Title>Services</Title>
      <div className="content">
        <Collapse onChange={onCollapseCallback}>{panels}</Collapse>
      </div>
    </React.Fragment>
  );
};

export default inject(Stores.TapiraApiStore)(observer(TapiraServicesList));
