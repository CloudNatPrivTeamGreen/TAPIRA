import React, { useCallback, useContext } from 'react';
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
import VersionUploadContext from '../../../contexts/version-upload-context';
import { ProposedMergeContext } from '../../../services/tapiraApiComparisonService/comparison-api';

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
  const versionUploadContext = useContext(VersionUploadContext);

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
      versionUploadContext.onNewVersionUpload();
      message.success(
        `The new version for ${serviceName} was successfully updated. The new version is ${newVersion}`
      );
    },
    [serviceName, tapiraApiSpecificationsStore, versionUploadContext]
  );

  const uploadExistingAPISpecifications = (file: File) => {
    const formData = createFileFormData(file);
    createCallbackForUpload(formData);
  };

  const onLoadJsonFile = (event: ProgressEvent<FileReader>) => {
    if (event.target?.result === undefined) {
      return;
    }

    const uploadedApi = JSON.parse(event.target?.result as string);
    tapiraApiComparisonStore?.saveUploadedApiSpec(uploadedApi);
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
        ).replace(RoutingParameters.Context, ProposedMergeContext.comparison)
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

    const fileReader = new FileReader();
    fileReader.onload = onLoadJsonFile;
    fileReader.readAsText(file);
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
          style={{
            backgroundColor: '#0084bd',
            borderColor: '#0084bd',
            color: 'white',
          }}
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
