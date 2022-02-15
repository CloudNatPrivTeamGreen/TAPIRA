import './index.scss';

import React, { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Typography, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Stores } from '../../stores/storeIdentifier';
import TapiraApiComparisonStore from '../../stores/tapiraApiComparisonStore';
import TapiraApiSpecificationsStore from '../../stores/tapiraApiSpecificationsStore';
import ApiDiffView from '../../components/PartialComponents/ApiDiffView';
import { ProposedMergeContext } from '../../services/tapiraApiComparisonService/comparison-api-dtos';

const { Title } = Typography;

const CompareSpecsPage = ({
  tapiraApiComparisonStore,
  tapiraApiSpecificationsStore,
}: {
  [Stores.TapiraApiComparisonStore]: TapiraApiComparisonStore;
  [Stores.TapiraApiSpecificationsStore]: TapiraApiSpecificationsStore;
}) => {
  const { serviceName } = useParams();

  const getCurrentVersion = useCallback(async () => {
    if (serviceName)
      await tapiraApiSpecificationsStore.getCurrentVersionSpecForService(
        serviceName
      );
  }, [serviceName, tapiraApiSpecificationsStore]);

  useEffect(() => {
    getCurrentVersion();
  }, [getCurrentVersion]);

  const onDownloadProposedMerge = useCallback(async () => {
    await tapiraApiComparisonStore.downloadProposedMerge(
      ProposedMergeContext.Comparison,
      tapiraApiComparisonStore.uploadedApiSpec,
      tapiraApiSpecificationsStore.currentServiceSpecificationsVersion
    );
  }, [
    tapiraApiComparisonStore,
    tapiraApiSpecificationsStore.currentServiceSpecificationsVersion,
  ]);

  return (
    <React.Fragment>
      <Title>{serviceName?.toUpperCase()} &#62; Compare</Title>
      <div className="content compare-specs">
        <ApiDiffView {...tapiraApiComparisonStore.compareSpecResponse} />
        <div className="cta-container">
          <Button
            size="large"
            icon={<DownloadOutlined />}
            onClick={onDownloadProposedMerge}
          >
            Download Proposed Merge
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default inject(
  Stores.TapiraApiComparisonStore,
  Stores.TapiraApiSpecificationsStore
)(observer(CompareSpecsPage));
