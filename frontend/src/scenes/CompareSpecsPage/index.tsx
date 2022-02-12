import React, { useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
// import { diff, formatters } from 'jsondiffpatch';
import { inject, observer } from 'mobx-react';
import { Typography } from 'antd';
import { Stores } from '../../stores/storeIdentifier';
import TapiraApiComparisonStore from '../../stores/tapiraApiComparisonStore';

const { Title } = Typography;

const CompareSpecsPage = ({
  tapiraApiComparisonStore,
}: {
  [Stores.TapiraApiComparisonStore]: TapiraApiComparisonStore;
}) => {
  const { serviceName } = useParams();
  // const visualSpecsCompareRef = useRef<HTMLDivElement>(null);

  // const getCurrentVersionSpecCallback = useCallback(async () => {
  //   if (!serviceName) {
  //     throw Error('No serviceName provided in the route');
  //   }

  //   await tapiraApiSpecificationsStore.getCurrentVersionSpecForService(
  //     serviceName
  //   );
  // }, [serviceName, tapiraApiSpecificationsStore]);

  // const visualizeDiff = useCallback(() => {
  //   const uploadedSpec = tapiraApiSpecificationsStore.specsToCompare;
  //   const currentSpecInDb =
  //     tapiraApiSpecificationsStore.currentServiceSpecificationsVersion;

  //   const delta = diff(uploadedSpec, currentSpecInDb);

  //   if (!delta || visualSpecsCompareRef.current === null) return;

  //   visualSpecsCompareRef.current.innerHTML = formatters.html.format(
  //     delta,
  //     currentSpecInDb
  //   );
  // }, [
  //   tapiraApiSpecificationsStore.currentServiceSpecificationsVersion,
  //   tapiraApiSpecificationsStore.specsToCompare,
  // ]);

  useEffect(() => {
    console.log(
      'in comparison page: ',
      tapiraApiComparisonStore.compareSpecReponse
    );
  }, [tapiraApiComparisonStore.compareSpecReponse]);

  return (
    <React.Fragment>
      <Title>{serviceName?.toUpperCase()} &#62; Compare</Title>
      <div className="content compare-specs">
        {/* <div ref={visualSpecsCompareRef}></div> */}
      </div>
    </React.Fragment>
  );
};

export default inject(Stores.TapiraApiComparisonStore)(
  observer(CompareSpecsPage)
);
