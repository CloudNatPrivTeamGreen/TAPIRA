import React, { useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import { Button, message } from 'antd';
import UploadJsonModal from '../UploadJsonModal';
import { Stores } from '../../../stores/storeIdentifier';
import TapiraApiSpecificationsStore from '../../../stores/tapiraApiSpecificationsStore';
import TapiraApiComparisonStore from '../../../stores/tapiraApiComparisonStore';
import {
  RoutePaths,
  RoutingParameters,
} from '../../../components/Router/router.config';

const createFileFormData = (file: File): FormData => {
  const blob = new Blob([file], {
    type: 'application/json',
  });
  const formData = new FormData();
  formData.append('file', blob);
  return formData;
};

const PanelCallToActions = ({
  serviceName,
  tapiraApiSpecificationsStore,
  tapiraApiComparisonStore,
}: {
  serviceName: string;
  [Stores.TapiraApiSpecificationsStore]?: TapiraApiSpecificationsStore;
  [Stores.TapiraApiComparisonStore]?: TapiraApiComparisonStore;
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
    const formData = createFileFormData(file);
    createCallbackForUpload(formData);
  };

  const createCallBackForComparison = useCallback(
    async (formData: FormData) => {
      await tapiraApiComparisonStore?.compareSpecsForService(
        serviceName,
        formData
      );
      navigate(
        RoutePaths.CompareSpecs.replace(
          RoutingParameters.ServiceName,
          serviceName
        )
      );
      message.success(
        'The specs to compare with the actual version was uploaded successfully'
      );
    },
    [navigate, serviceName, tapiraApiComparisonStore]
  );

  const compareUploadedJson = (file: File) => {
    const formData = createFileFormData(file);
    createCallBackForComparison(formData);
  };

  return (
    <React.Fragment>
      <div
        className="collapse__panel__cta-container"
        onClick={(event) => onClickPreventDefault(event)}
      >
        <UploadJsonModal
          serviceName={serviceName}
          onHandleOk={uploadExistingAPISpecifications}
          buttonText="Upload"
          buttonType="primary"
        />
        <UploadJsonModal
          serviceName={serviceName}
          onHandleOk={compareUploadedJson}
          buttonText="Compare"
        />
        <Button
          style={{ backgroundColor: 'greenyellow', borderColor: 'greenyellow' }}
        >
          <Link
            to={RoutePaths.Evolution.replace(
              RoutingParameters.ServiceName,
              serviceName
            )}
          >
            Evolution
          </Link>
        </Button>
      </div>
    </React.Fragment>
  );
};

export default inject(
  Stores.TapiraApiSpecificationsStore,
  Stores.TapiraApiComparisonStore
)(observer(PanelCallToActions));
