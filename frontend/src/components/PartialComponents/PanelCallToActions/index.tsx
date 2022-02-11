import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import { Button, message } from 'antd';
import UploadJsonModal from '../UploadJsonModal';
import { Stores } from '../../../stores/storeIdentifier';
import TapiraApiSpecificationsStore from '../../../stores/tapiraApiSpecificationsStore';
import {
  RoutePaths,
  RoutingParameters,
} from '../../../components/Router/router.config';

const PanelCallToActions = ({
  serviceName,
  tapiraApiSpecificationsStore,
}: {
  serviceName: string;
  [Stores.TapiraApiSpecificationsStore]?: TapiraApiSpecificationsStore;
}) => {
  const navigate = useNavigate();

  const onClickPreventDefault = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const createCallbackForUpload = useCallback(
    async (formData: FormData) => {
      const newVersion =
        await tapiraApiSpecificationsStore?.uploadExistingAPISpecifications(
          serviceName,
          formData
        );
      message.success(
        `The new version for ${serviceName} was successfully updated. The new version is ${newVersion}`
      );
    },
    [serviceName, tapiraApiSpecificationsStore]
  );

  const uploadExistingAPISpecifications = (file: File) => {
    const blob = new Blob([file], {
      type: 'application/json',
    });
    const formData = new FormData();
    formData.append('file', blob);
    createCallbackForUpload(formData);
  };

  const onReaderLoad = (event: ProgressEvent<FileReader>) => {
    if (!event.target?.result) return;

    let specs = JSON.parse(event.target?.result as string);
    tapiraApiSpecificationsStore?.saveUploadedSpecToCompare(specs);
    navigate(
      RoutePaths.CompareSpecs.toString().replace(
        RoutingParameters.ServiceName,
        serviceName
      )
    );
  };

  const compareUploadedJson = (file: File) => {
    let reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(file);
  };

  return (
    <React.Fragment>
      <div
        className="collapse__panel__cta-container"
        onClick={(event) => onClickPreventDefault(event)}
      >
        <UploadJsonModal
          serviceName={serviceName}
          buttonText="Upload"
          onHandleOk={uploadExistingAPISpecifications}
        />
        <UploadJsonModal
          serviceName={serviceName}
          buttonText="Compare"
          onHandleOk={compareUploadedJson}
        />
        <Button>Evolution</Button>
      </div>
    </React.Fragment>
  );
};

export default inject(Stores.TapiraApiSpecificationsStore)(
  observer(PanelCallToActions)
);
