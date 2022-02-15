import React, { useEffect, useCallback, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Stores } from '../../stores/storeIdentifier';
import TapiraApiProposalsStore from '../../stores/tapiraApiProposalsStore';
import { Typography } from 'antd';

import './index.scss';

const { Title } = Typography;


const ConflictsPage = ({
  tapiraApiProposalsStore,
}: {
  [Stores.TapiraApiProposalsStore]: TapiraApiProposalsStore;
}) => {

  const [allConflictsList, setAllConflictsList] = useState<Array<string>>(new Array<string>());

  const getAllConflicts = useCallback(async () => {
    await tapiraApiProposalsStore.getAllConflicts();
    setAllConflictsList(
      tapiraApiProposalsStore.allConflictsList
    );
  }, [tapiraApiProposalsStore]);

  useEffect(() => {
    getAllConflicts();
  }, [getAllConflicts]);


  return <React.Fragment>
    <Title> Conflicts </Title>
    <div className="content">
      {
      allConflictsList.map((serv) => (
        <div className="conflicts-list">
          {serv}
        </div>
      ))
      }
    </div>
  </React.Fragment>;

};

export default inject(Stores.TapiraApiProposalsStore)(observer(ConflictsPage));
