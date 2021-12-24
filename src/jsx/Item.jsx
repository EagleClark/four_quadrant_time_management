import { Modal, Checkbox, Descriptions, Badge } from 'antd';
import { DeleteOutlined, EditOutlined, FileTextOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useState, useContext, useRef } from 'react';
import { AppContext } from '../js/Context';
import '../css/Item.css';
import { dtFormat, num2DateTypeZh, quadrant2Text } from '../js/Utils';
import ItemPop from './ItemPop';

export default function Item(props) {
  const { key, title, dttype, dt, done, quadrant, detail } = props.itemInfo;
  const [isDone, setIsDone] = useState(done);
  const ctx = useContext(AppContext);
  const { Database, setRandomKey } = ctx;
  const doneStyle = {
    textDecoration: 'line-through',
    color: 'gray',
  };
  const popRef = useRef();

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

  function updateIteam() {
    popRef.current.showModal();
  }

  function detailItem() {
    Modal.info({
      title: '任务详情',
      width: 650,
      content: (
        <Descriptions
          title=""
          bordered
          column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 2 }}
        >
          <Descriptions.Item label="摘要" span={2}>{title}</Descriptions.Item>
          <Descriptions.Item label="时间模式">{num2DateTypeZh(dttype)}</Descriptions.Item>
          <Descriptions.Item label="日期">{dtFormat(dt, dttype)}</Descriptions.Item>
          <Descriptions.Item label="重要紧急程度">{quadrant2Text(quadrant)}</Descriptions.Item>
          <Descriptions.Item label="完成情况"><Badge status={done === 0 ? "processing" : "success"} text={done === 0 ? "进行中" : "已完成"}/></Descriptions.Item>
          <Descriptions.Item label="详情" span={2}>{detail}</Descriptions.Item>
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
      <span className='item-edit' onClick={updateIteam}><EditOutlined /></span>
      <span className='item-del' onClick={deleteItem}><DeleteOutlined /></span>
      <ItemPop mode='update' itemData={{ key, title, dttype, dt, quadrant, detail }} ref={popRef} />
    </div>
  );
}