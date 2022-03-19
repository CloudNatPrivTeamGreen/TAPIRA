import { Row, Col } from 'antd';

import { GlobalChanges } from '../../../services/tapiraApiComparisonService/comparison-api';
import { Utils } from '../../../utils/utils';
import RenderColumnDataList from '../RenderColumnDataList';

const GlobalChangesList = ({
  globalChanges,
}: {
  globalChanges: GlobalChanges;
}) => {
  const flattened = Utils.flattenObject(globalChanges);
  const newValues = {};
  const oldValues = {};
  for (const key in flattened) {
    const keyWithoutNewOld = key
      .replace('old.', '')
      .replace('new.', '')
      .replace('missing.', '')
      .replace('changed.', '');
    if (key.includes('new')) {
      newValues[keyWithoutNewOld] = flattened[key];
    } else {
      oldValues[keyWithoutNewOld] = flattened[key];
    }
  }

  return (
    <Row>
      <Col span={12}>
        <RenderColumnDataList data={newValues} />
      </Col>
      <Col span={12}>
        <RenderColumnDataList data={oldValues} />
      </Col>
    </Row>
  );
};

export default GlobalChangesList;
