import { Fragment } from 'react';
import { List, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Utils } from '../../../utils/utils';

const IconForBoolean = ({ present }: { present: boolean }) => {
  return present ? <CheckCircleOutlined /> : <CloseCircleOutlined />;
};

const RenderColumnDataList = ({ data }: { data: any }) => {
  const uuid = Utils.uuidv4();
  return (
    <Fragment>
      <List
        key={uuid}
        size="small"
        bordered
        dataSource={Object.keys(data)}
        renderItem={(key, index) => (
          <List.Item key={key + index + uuid}>
            <strong>{key}: </strong>{' '}
            {data[key] !== null && typeof data[key] !== 'boolean' && (
              <span className="value-green">{data[key]}</span>
            )}
            {data[key] !== null && typeof data[key] === 'boolean' && (
              <span className="value-green">
                <IconForBoolean present={data[key]} />
              </span>
            )}
            {data[key] === null && <Tag color="red">N/A</Tag>}
          </List.Item>
        )}
      />
    </Fragment>
  );
};

export default RenderColumnDataList;
