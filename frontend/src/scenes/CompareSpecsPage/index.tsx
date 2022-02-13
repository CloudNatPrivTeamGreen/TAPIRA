import React from 'react';
import { useParams } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Typography } from 'antd';
import { Stores } from '../../stores/storeIdentifier';
import TapiraApiComparisonStore from '../../stores/tapiraApiComparisonStore';
import ApiDiffView from '../../components/PartialComponents/ApiDiffView';

const { Title } = Typography;

const CompareSpecsPage = ({
  tapiraApiComparisonStore,
}: {
  [Stores.TapiraApiComparisonStore]: TapiraApiComparisonStore;
}) => {
  const { serviceName } = useParams();

  return (
    <React.Fragment>
      <Title>{serviceName?.toUpperCase()} &#62; Compare</Title>
      <div className="content compare-specs">
        <ApiDiffView {...tapiraApiComparisonStore.compareSpecResponse} />
      </div>
    </React.Fragment>
  );
};

export default inject(Stores.TapiraApiComparisonStore)(
  observer(CompareSpecsPage)
);
