import React, { useEffect, useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import { Stores } from '../../stores/storeIdentifier';
import TapiraApiProposalsStore from '../../stores/tapiraApiProposalsStore';

const ConflictsPage = ({
  tapiraApiProposalsStore,
}: {
  [Stores.TapiraApiProposalsStore]: TapiraApiProposalsStore;
}) => {
  const getAllConflicts = useCallback(async () => {
    await tapiraApiProposalsStore.getAllConflicts();
  }, [tapiraApiProposalsStore]);

  return <React.Fragment></React.Fragment>;
};

export default inject(Stores.TapiraApiProposalsStore)(observer(ConflictsPage));
