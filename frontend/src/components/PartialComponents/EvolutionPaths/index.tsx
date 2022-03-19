import { Fragment } from 'react';
import { Collapse, List } from 'antd';
import {
  Path,
  PathInfo,
} from '../../../services/tapiraApiComparisonService/comparison-api';
import { Utils } from '../../../utils/utils';

const { Panel } = Collapse;

interface PathInfoListitem {
  title: string;
  isRemoved: boolean;
}

const renderInfoList = (flattenedObj: any) => {
  const dataSource: PathInfoListitem[] = [];
  const sortedKeys = Utils.sortObjectKeys(flattenedObj, (a, b) => {
    const aspl = a.split('.');
    const bspl = b.split('.');
    if (aspl.length > bspl.length) {
      return 1;
    } else if (aspl.length < bspl.length) {
      return -1;
    } else {
      return 0;
    }
  });

  for (const key of sortedKeys) {
    const splittedKey = key.split('.');
    if (splittedKey.length === 5) {
      dataSource.push({
        title: splittedKey[3],
        isRemoved: flattenedObj[key],
      });
    } else if (splittedKey.length === 3) {
      dataSource.push({
        title: splittedKey[1],
        isRemoved: flattenedObj[key],
      });
    }
  }

  return (
    <List
      bordered
      dataSource={dataSource}
      renderItem={(item) => (
        <List.Item
          className={item.isRemoved ? 'path-info--red' : 'path-info--green'}
        >
          {item.title}
        </List.Item>
      )}
    />
  );
};

const renderPathPanel = (path: string, pathInfo: PathInfo) => {
  const flattened = Utils.flattenObject(pathInfo);

  return (
    <Panel
      header={path}
      key={path}
      collapsible={flattened.isRemoved ? 'disabled' : undefined}
    >
      {renderInfoList(flattened)}
    </Panel>
  );
};

const EvolutionPaths = ({ pathsInfo }: { pathsInfo: Path }) => {
  return (
    <Fragment>
      <Collapse accordion>
        {Object.keys(pathsInfo).map((path) =>
          renderPathPanel(path, pathsInfo[path])
        )}
      </Collapse>
    </Fragment>
  );
};

export default EvolutionPaths;
