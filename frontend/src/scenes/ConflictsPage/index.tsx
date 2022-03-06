import React, { useEffect, useCallback, useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Stores } from '../../stores/storeIdentifier';
import TapiraApiProposalsStore from '../../stores/tapiraApiProposalsStore';
import { List, Typography } from 'antd';
import { Link } from 'react-router-dom';
import {
  RoutePaths,
  RoutingParameters,
} from '../../components/Router/router.config';
import './index.scss';
import { Utils } from '../../utils/utils';
import { ProposedMergeContext } from '../../services/tapiraApiComparisonService/comparison-api-dtos';

const { Title } = Typography;

const ConflictsPage = ({
  tapiraApiProposalsStore,
}: {
  [Stores.TapiraApiProposalsStore]: TapiraApiProposalsStore;
}) => {
  const [allConflictsList, setAllConflictsList] = useState<string[]>([]);

  const getAllConflicts = useCallback(async () => {
    await tapiraApiProposalsStore.getAllConflicts();
    setAllConflictsList(tapiraApiProposalsStore.allConflictsList);
  }, [tapiraApiProposalsStore]);

  useEffect(() => {
    getAllConflicts();
  }, [getAllConflicts]);

  return (
    <React.Fragment>
      <Title> Conflicts </Title>
      <div className="content conflicts-list">
        <List
          size="default"
          bordered
          dataSource={allConflictsList}
          renderItem={(conflict: string, index: number) => (
            <List.Item key={index + conflict} className="conflicts-list__item">
              <Link
                to={RoutePaths.CompareSpecs.replace(
                  RoutingParameters.ServiceName,
                  conflict
                ).replace(
                  RoutingParameters.Context,
                  ProposedMergeContext.validation
                )}
              >
                <span className="conflict-title">
                  {Utils.capitalizePropertyName(conflict)}
                </span>
              </Link>
            </List.Item>
          )}
        />
      </div>
    </React.Fragment>
  );
};

export default inject(Stores.TapiraApiProposalsStore)(observer(ConflictsPage));
