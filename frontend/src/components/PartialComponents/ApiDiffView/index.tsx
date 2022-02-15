import './index.scss';

import React from 'react';
import { Divider, List, Descriptions, Tag } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  IApiDiffs,
  INewEndpoint,
  IMissingEndpoint,
  IChangedOperation,
} from '../../../services/tapiraApiComparisonService/comparison-api-dtos';
import { Utils } from '../../../utils/utils';

const ApiDiffView = ({ api_diffs }: { api_diffs: IApiDiffs | undefined }) => {
  let displayList: string[] = [
    Utils.nameof<IApiDiffs>('new_endpoints'),
    Utils.nameof<IApiDiffs>('missing_endpoints'),
  ];

  const listView = displayList.map((apiDiffKey: string) => (
    <React.Fragment key={apiDiffKey}>
      <Divider orientation="left">
        {Utils.capitalizePropertyName(apiDiffKey)}
      </Divider>
      {api_diffs?.[apiDiffKey]?.length && (
        <List
          className={`api-diff-view__${apiDiffKey}`}
          size="small"
          bordered
          dataSource={api_diffs?.[apiDiffKey]}
          renderItem={(item: IMissingEndpoint | INewEndpoint) => (
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
      )}
      {!api_diffs?.[apiDiffKey]?.length && (
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
          {`No ${Utils.capitalizePropertyName(apiDiffKey)} available`}
        </Tag>
      )}
    </React.Fragment>
  ));

  let changedOperations = (
    <React.Fragment>
      <Divider orientation="left">Missing Endpoints</Divider>
      {api_diffs?.changed_operations?.length && (
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
      )}
      {!api_diffs?.changed_operations?.length && (
        <Tag icon={<ExclamationCircleOutlined />} color="warning">
          No Changed Operations available
        </Tag>
      )}
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <div className="api-diff-view">
        {listView}
        {changedOperations}
      </div>
    </React.Fragment>
  );
};

export default ApiDiffView;
