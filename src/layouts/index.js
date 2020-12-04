import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Table, Pagination } from 'antd';
import {TxPool} from 'web3-eth-txpool';
const rpc = 'https://gwan-ssl.wandevs.org:56891';

const columns = [
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Nonce',
    dataIndex: 'nonce',
    key: 'nonce',
  },
  {
    title: 'From',
    dataIndex: 'from',
    key: 'from',
  },
  {
    title: 'To',
    dataIndex: 'to',
    key: 'to',
  },
  {
    title: 'Value',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: 'Gas Limit',
    dataIndex: 'gasLimit',
    key: 'gasLimit',
  },
  {
    title: 'Gas Price',
    dataIndex: 'gasPrice',
    key: 'gasPrice',
    render: text => {
      if (Number(text) >= 1e9) {
        return <div>{text}</div>
      } else {
        return <Warn>{text}</Warn>;
      }
    },
  },
];

function BasicLayout(props) {
  const [txData, setTxData] = useState();

  useEffect(() => {
    const func = async () => {
      const txPool = new TxPool(rpc);
      console.log('getting');
      const inspect = await txPool.getInspection()
      console.log('txPool', inspect);
      let tx = [];

      for (var from in inspect.pending) {
        for (var nonce in inspect.pending[from]) {
          let strs = inspect.pending[from][nonce].split(' ');
          tx.push({
            type:'pending',
            nonce,
            from,
            to: strs[0].slice(0, -1),
            value: strs[1] + ' wei',
            gasLimit: strs[4],
            gasPrice: strs[6],
          })
        }
      }

      for (var from in inspect.queued) {
        for (var nonce in inspect.queued[from]) {
          let strs = inspect.queued[from][nonce].split(' ');
          tx.push({
            type:'queued',
            nonce,
            from,
            to: strs[0].slice(0, -1),
            value: strs[1] + ' wei',
            gasLimit: strs[4],
            gasPrice: strs[6],
          })
        }
      }
      setTxData(tx);
    }

    func();
  }, []);

  return (
    <Body>
      <Title>Wanchain Mainnet Pending Transactions</Title>
      <Table columns={columns} dataSource={txData} size='small' pagination={{pageSize: 200}}/>
    </Body>
  );
}

export default BasicLayout;

const Body = styled.div`
  text-align: center;
`;

const Title = styled.div`
  font-size: 40px;
  margin-bottom: 60px;
  margin-top: 40px;
`;

const Warn = styled.div`
  color: red;
`;
