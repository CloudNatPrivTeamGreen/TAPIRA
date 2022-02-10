import React, { useEffect, useCallback, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Stores } from '../../../stores/storeIdentifier';
import TapiraApiSpecificationsStore from '../../../stores/tapiraApiSpecificationsStore';

const CompareJsonVersions = ({
  serviceName,
  tapiraApiSpecificationsStore,
}: {
  serviceName: string;
  [Stores.TapiraApiSpecificationsStore]?: TapiraApiSpecificationsStore;
}) => {
  return <React.Fragment></React.Fragment>;
};

export default inject(Stores.TapiraApiSpecificationsStore)(
  observer(CompareJsonVersions)
);
