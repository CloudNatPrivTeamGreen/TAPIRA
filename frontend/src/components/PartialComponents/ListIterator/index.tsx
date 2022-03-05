import { Tag, List } from 'antd';
import * as _ from 'lodash';

const ListIterator = ({ propName, obj }: { propName: string; obj: any }) => {
  const notFoundEl = <Tag color="orange">N/A</Tag>;
  if (typeof obj !== 'object') {
    const el = obj ? <strong>{obj} %</strong> : notFoundEl;
    return (
      <span>
        {propName}: {el}
      </span>
    );
  } else {
    if (_.isEmpty(obj)) {
      return (
        <span>
          {propName}: {notFoundEl}
        </span>
      );
    } else {
      return (
        <List
          size="small"
          header={<strong>{propName}</strong>}
          bordered
          dataSource={Object.keys(obj)}
          renderItem={(item: string, index) => (
            <List.Item key={index}>
              <ListIterator propName={item} obj={obj[item]} />
            </List.Item>
          )}
        />
      );
    }
  }
};

export default ListIterator;
