import { Modal, Checkbox, Descriptions } from 'antd';
import { DeleteOutlined, EditOutlined, FileTextOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useState, useContext } from 'react';
import { AppContext } from './js/Context';
import './css/Item.css';
import { num2DateTypeZh } from './js/Utils';
import moment from 'moment';

export default function Item(props) {
  const { key, title, dttype, dt, done, quadrant, detail } = props.itemInfo;
  const [isDone, setIsDone] = useState(done);
  const ctx = useContext(AppContext);
  const { Database, setRandomKey } = ctx;
  const doneStyle = {
    textDecoration: 'line-through',
    color: 'gray',
  };

  function onChange(e) {
    const done = !isDone ? 1 : 0; // 取反是因为这时状态还没有更新
    Database.updateDoneByKey(key, done).then(res => {
      if (res === 1) {
        setIsDone(e.target.checked);
        setRandomKey(Math.random());
      }
    })
  }

  function deleteItem() {
    Modal.confirm({
      title: '是否确定删除？',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        Database.deleteItem(key).then(res => {
          if (res === 1) {
            setRandomKey(Math.random());
          }
        })
      },
      onCancel() {},
    });
  }

  function detailItem() {
    Modal.info({
      title: '任务详情',
      width: 600,
      content: (
        <Descriptions
          title=""
          bordered
          column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
        >
          <Descriptions.Item label="摘要" span={4}>{title}</Descriptions.Item>
          <Descriptions.Item label="时间模式" span={2}>{num2DateTypeZh(dttype)}</Descriptions.Item>
          <Descriptions.Item label="日期" span={2}>{moment(dt).format("YYYY-MM-DD")}</Descriptions.Item>
          <Descriptions.Item label="重要紧急程度" span={2}>{quadrant}</Descriptions.Item>
          <Descriptions.Item label="完成情况" span={2}>{done}</Descriptions.Item>
          <Descriptions.Item label="详情" span={4}>{detail}</Descriptions.Item>
        </Descriptions>
      ),
      onOk() {},
    });
  }

  return (
    <div className='item-div'>
      <Checkbox checked={isDone} onChange={onChange}></Checkbox>
      <span className='item-span' style={isDone ? doneStyle: {}}>{title}</span>
      <span className='item-detail' onClick={detailItem}><FileTextOutlined /></span>
      <span className='item-edit' onClick={deleteItem}><EditOutlined /></span>
      <span className='item-del' onClick={deleteItem}><DeleteOutlined /></span>
    </div>
  );
}