import React, { useEffect, useState } from 'react';
import { List, Avatar, Button, Skeleton } from 'antd';
import Aux from '../../utils/util-components/aux1';

const COUNT = 3;
const FakeDataURL = `https://randomuser.me/api/?results=${COUNT}&inc=name,gender,email,nat,picture&noinfo`;

const OpenApiList = (props) => {
    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [list, setList] = useState([]);

    useEffect(() => {
        fetch(FakeDataURL)
        .then(res  => res.json())
        .then(res => {
            setInitLoading(false);
            setData(res.results);
            setList(res.results);
        });
    }, []);

    const onLoadMore = () => {
        setLoading(true);
        setList(
            (prevVal) => data.concat(
                    [...new Array(COUNT)].map(() => ({ loading: true, name: {}, picture: {}}))
                )
        );

        fetch(FakeDataURL)
        .then(res => res.json())
        .then(res => {
            const newData = data.concat(res.results);
            setData(newData);
            setList(newData);
            setLoading(false);
            window.dispatchEvent(new Event('resize'));
        });

    }

    const loadMore =
      !initLoading && !loading ? (
        <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button onClick={onLoadMore}>loading more</Button>
        </div>
      ) : null;


    return (
        <Aux>
            <List
                className="demo-loadmore-list"
                loading={initLoading}
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={list}
                renderItem={item => (
                <List.Item
                    actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
                >
                    <Skeleton avatar title={false} loading={item.loading} active>
                    <List.Item.Meta
                        avatar={<Avatar src={item.picture.large} />}
                        title={<a href={undefined}>{item.name.last}</a>}
                    />
                    <div>content</div>
                    </Skeleton>
                </List.Item>
                )}
            />
        </Aux>
    );
}

export default OpenApiList;

