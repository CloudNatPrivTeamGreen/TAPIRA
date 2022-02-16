import React, { useEffect, useCallback } from 'react';
import { inject, observer } from 'mobx-react';
import { Stores } from '../../../stores/storeIdentifier';
import TestingStore from '../../../stores/testingStore';

const EvolutionTestPage = ({
  testingStore,
}: {
  [Stores.TestingStore]: TestingStore;
}) => {
  const getEvolution = useCallback(async () => {
    await testingStore.getEvolutionForTest();

    console.log('in evolution test', testingStore.evolutionResponse);
  }, [testingStore]);

  useEffect(() => {
    getEvolution();
  }, [getEvolution]);

  return <React.Fragment></React.Fragment>;
};

export default inject(Stores.TestingStore)(observer(EvolutionTestPage));
