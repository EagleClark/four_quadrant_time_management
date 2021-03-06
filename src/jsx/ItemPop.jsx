import { forwardRef, useCallback, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { DatePicker, Select, Space, Modal, Input } from 'antd';
import { IMPORTANT_COLOR, NORMAL_COLOR, URGENT_COLOR, URGENT_IMPORTANT_COLOR } from '../js/Constant';
import moment from 'moment';
import { AppContext } from '../js/Context';
import Database from '../js/Database';
import { dateType2Num } from '../js/Utils';

const { Option } = Select;
const { TextArea } = Input;

function ItemPop(props, ref) {
  const mode = props.mode;
  const itemData = props.itemData || {};
  const ctx = useContext(AppContext);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const key = itemData.key;
  const [type, setType] = useState(itemData.type || 'date');
  const dttype = useRef(itemData.dttype || 1);
  const [dt, setDt] = useState(itemData.dt ? moment(itemData.dt) : moment());
  const [title, setTitle] = useState(itemData.title || '');
  const [detail, setDetail] = useState(itemData.detail || '');
  const [quadrant, setQuadrant] = useState(itemData.quadrant || 1);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (mode === 'add') {
      const item = [dttype.current, +dt, title, quadrant, 0, detail];
      Database.addItem(item).then(rowsAffected => {
        if (rowsAffected === 1) {
          ctx.setRandomKey(Math.random());
          clearModalDatas();
          setIsModalVisible(false);
        }
      });
    } else if (mode === 'update') {
      const item = [dttype.current, +dt, title, quadrant, detail];
      Database.updateItemByKey(key, item).then(rowsAffected => {
        if (rowsAffected === 1) {
          ctx.setRandomKey(Math.random());
          setIsModalVisible(false);
        }
      });
    }
  };

  const handleCancel = () => {
    if (mode === 'add') {
      clearModalDatas();
    }
    setIsModalVisible(false);
  };

  function clearModalDatas() {
    setType('date');
    setDt(moment());
    setTitle('');
    setDetail('');
    setQuadrant(1);
  }

  useImperativeHandle(ref, () => ({
    showModal,
  }))

  const getButtonStyle = useCallback((q) => {
    if (quadrant === q) {
      switch (q) {
        case 1:
          return { backgroundColor: URGENT_IMPORTANT_COLOR, color: 'white' };
        case 2:
          return { backgroundColor: URGENT_COLOR, color: 'white' };
        case 3:
          return { backgroundColor: NORMAL_COLOR, color: 'white' };
        case 4:
          return { backgroundColor: IMPORTANT_COLOR, color: 'white' };
        default:
          return { backgroundColor: URGENT_IMPORTANT_COLOR, color: 'white' };
      }
    } else {
      return {};
    }
  }, [quadrant]);

  useEffect(() => {
    dttype.current = dateType2Num(type);
  }, [type]);

  return (
    <Modal title={mode === 'add' ? '??????' : '??????'} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Space direction="vertical">
        <Space>
          <Select value={type} onChange={setType}>
            <Option value="date">???</Option>
            <Option value="week">???</Option>
            <Option value="month">???</Option>
            <Option value="year">???</Option>
          </Select>
          <DatePicker allowClear={false} picker={type} onChange={value => setDt(value)} value={dt} />
        </Space>
        <Space size={0}>
          <button className='top-button' style={getButtonStyle(1)} onClick={() => setQuadrant(1)}>???????????????</button>
          <button className='top-button' style={getButtonStyle(2)} onClick={() => setQuadrant(2)}>??????????????????</button>
          <button className='top-button' style={getButtonStyle(3)} onClick={() => setQuadrant(3)}>??????????????????</button>
          <button className='top-button' style={getButtonStyle(4)} onClick={() => setQuadrant(4)}>??????????????????</button>
        </Space>
        <Input placeholder="??????????????????" value={title} onChange={e => setTitle(e.target.value)} />
        <TextArea placeholder="??????????????????" showCount maxLength={500} rows={4} value={detail} onChange={e => setDetail(e.target.value)} />
      </Space>
    </Modal>
  )
}

export default forwardRef(ItemPop);