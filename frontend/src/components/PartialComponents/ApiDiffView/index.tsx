import './index.scss';

import React from 'react';
import { Divider, List, Descriptions } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {
  IApiDiffs,
  IChangedOperation,
} from '../../../services/tapiraApiComparisonService/comparison-api-dtos';
import { Utils } from '../../../utils/utils';

const ApiDiffView = ({ api_diffs }: { api_diffs: IApiDiffs | undefined }) => {
  let displayList: string[] = [];
  if (api_diffs?.new_endpoints?.length) {
    displayList.push(Utils.nameof<IApiDiffs>('new_endpoints'));
  }
  if (api_diffs?.missing_endpoints?.length) {
    displayList.push(Utils.nameof<IApiDiffs>('missing_endpoints'));
  }
  let newEndpoints;
  if (api_diffs?.new_endpoints?.length) {
    newEndpoints = (
      <React.Fragment>
        <Divider orientation="left">New Endpoints</Divider>
        <List
          className="api-diff-view__new_endpoints"
          size="small"
          bordered
          dataSource={api_diffs?.new_endpoints}
          renderItem={(item) => (
            <List.Item>
              <Descriptions>
                {Object.keys(item).map((key: string) => (
                  <Descriptions.Item label={Utils.capitalizePropertyName(key)}>
                    {typeof item[key] === 'boolean' && item[key] === true && (
                      <CheckCircleOutlined className="diff-check-circle" />
                    )}
                    {typeof item[key] === 'boolean' && item[key] === false && (
                      <CloseCircleOutlined className="diff-close-circle" />
                    )}
                    {typeof item[key] !== 'boolean' && item[key]}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </List.Item>
          )}
        />
      </React.Fragment>
    );
  }

  let missingEndpoints;
  if (api_diffs?.missing_endpoints?.length) {
    missingEndpoints = (
      <React.Fragment>
        <Divider orientation="left">Missing Endpoints</Divider>
        <List
          className="api-diff-view__missing_endpoints"
          size="small"
          bordered
          dataSource={api_diffs?.missing_endpoints}
          renderItem={(item) => (
            <List.Item>
              <Descriptions>
                {Object.keys(item).map((key: string) => (
                  <Descriptions.Item label={Utils.capitalizePropertyName(key)}>
                    {typeof item[key] === 'boolean' && item[key] === true && (
                      <CheckCircleOutlined className="diff-check-circle" />
                    )}
                    {typeof item[key] === 'boolean' && item[key] === false && (
                      <CloseCircleOutlined className="diff-close-circle" />
                    )}
                    {typeof item[key] !== 'boolean' && item[key]}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </List.Item>
          )}
        />
      </React.Fragment>
    );
  }

  let changedOperations;
  if (api_diffs?.changed_operations?.length) {
    changedOperations = (
      <React.Fragment>
        <Divider orientation="left">Missing Endpoints</Divider>
        <List
          className="api-diff-view__changed-operations"
          size="small"
          bordered
          dataSource={api_diffs?.changed_operations}
          renderItem={(item) => (
            <List.Item>
              <Descriptions>
                {Object.keys(item).map((key: string) => (
                  <Descriptions.Item label={Utils.capitalizePropertyName(key)}>
                    {key !==
                      Utils.nameof<IChangedOperation>('changed_fields') &&
                      item[key]}
                    {key ===
                      Utils.nameof<IChangedOperation>('changed_fields') &&
                      item.changed_fields.join('; ')}
                  </Descriptions.Item>
                ))}
              </Descriptions>
            </List.Item>
          )}
        />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div className="api-diff-view">
        {newEndpoints}
        {missingEndpoints}
        {changedOperations}
      </div>
    </React.Fragment>
  );
};

export default ApiDiffView;
