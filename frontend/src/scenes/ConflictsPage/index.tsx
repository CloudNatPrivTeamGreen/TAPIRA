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
import {ProposedMergeContext} from "../../services/tapiraApiComparisonService/comparison-api-dtos";
import TapiraApiComparisonStore from "../../stores/tapiraApiComparisonStore";

const { Title } = Typography;

const ConflictsPage = ({
  tapiraApiProposalsStore, tapiraApiComparisonStore
}: {
  [Stores.TapiraApiProposalsStore]: TapiraApiProposalsStore;
  [Stores.TapiraApiComparisonStore]: TapiraApiComparisonStore;
}) => {
  const [allConflictsList, setAllConflictsList] = useState<Array<string>>(
    new Array<string>()
  );

  const getAllConflicts = useCallback(async () => {
    await tapiraApiProposalsStore.getAllConflicts();
    setAllConflictsList(tapiraApiProposalsStore.allConflictsList);
  }, [tapiraApiProposalsStore]);

  const getConflictAndReconstructedSpec = async (serviceName) => {
      await tapiraApiComparisonStore.getConflictsForService(serviceName);
      await tapiraApiProposalsStore.getProposedSpecsForService(serviceName)
  }

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
                ).replace(RoutingParameters.Version, conflict).replace(RoutingParameters.Context, ProposedMergeContext.Validation)}

                onClick={(event) => getConflictAndReconstructedSpec(conflict)}
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

export default inject(Stores.TapiraApiProposalsStore, Stores.TapiraApiComparisonStore)(observer(ConflictsPage));
