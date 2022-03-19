import Aux from '../../../utils/util-components/aux1';
import { Collapse, Table } from 'antd';
import { Schemas } from '../../../services/tapiraApiComparisonService/comparison-api';
import RenderColumnDataList from '../RenderColumnDataList';

const { Panel } = Collapse;

const OldNewTable = ({ data }: { data: any }) => {
  const columns: any[] = [
    {
      title: 'New',
      align: 'center',
      width: '50%',
      dataIndex: 'new',
      key: 'new',
      render: (renderData: any) => <RenderColumnDataList data={renderData} />,
    },
    {
      title: 'Old',
      align: 'center',
      width: '50%',
      dataIndex: 'old',
      key: 'old',
      render: (renderData: any) => <RenderColumnDataList data={renderData} />,
    },
  ];
  const dataSource = [{ new: data.new, old: data.old }];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      bordered
      size="middle"
      pagination={false}
    />
  );
};

const schemaPropPanels = (
  schemaProp: { [path: string]: { new: any; old: any } },
  schemaName: string
) => {
  return Object.keys(schemaProp).map((schemaPropKey: string, index: number) => (
    <Panel
      header={schemaPropKey}
      key={`${schemaPropKey}.${index}`}
      className={schemaName}
    >
      <OldNewTable data={schemaProp[schemaPropKey]} />
    </Panel>
  ));
};

const CollapseForSchemas = ({ schemas }: { schemas: Schemas }) => {
  return (
    <Aux>
      <Collapse>
        {Object.keys(schemas)
          .map((schemaKey: string) =>
            schemaPropPanels(schemas[schemaKey], schemaKey)
          )
          .flat()}
      </Collapse>
    </Aux>
  );
};

export default CollapseForSchemas;
