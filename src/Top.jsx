import { useCallback, useEffect, useRef, useState } from 'react';
import { DatePicker, Select, Space, Modal, Button, Input } from 'antd';
import { InfoOutlined, PlusOutlined } from '@ant-design/icons';
import './css/Top.css';
import { IMPORTANT_COLOR, NORMAL_COLOR, URGENT_COLOR, URGENT_IMPORTANT_COLOR } from './js/Constant';
import moment from 'moment';
import { dateType2Num, num2DateType } from './js/Utils';
import { AppContext } from './js/Context';
import { useContext } from "react";
import Database from "./js/Database";

const { Option } = Select;
const { TextArea } = Input;

export default function Top() {
  const ctx = useContext(AppContext);
  const { state, dispatch } = ctx;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [type4Add, setType4Add] = useState('date');
  const dttype4Add = useRef(1);
  const [dt4Add, setDt4Add] = useState(moment());
  const [title4Add, setTitle4Add] = useState('');
  const [detail4Add, setDetail4Add] = useState('');
  const [quadrant, setQuadrant] = useState(1);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    const item = [dttype4Add.current, +dt4Add, title4Add, quadrant, 0, detail4Add];
    Database.addItem(item).then(rowsAffected => {
      if (rowsAffected === 1) {
        ctx.setRandomKey(Math.random());
        setType4Add('date');
        setDt4Add(moment());
        setTitle4Add('');
        setDetail4Add('');
        setQuadrant(1);
        setIsModalVisible(false);
      }
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function info() {
    Modal.info({
      title: '四象限时间管理',
      content: (
        <div className='top-info-div'>
          <p className='top-info-p' style={{ backgroundColor: URGENT_IMPORTANT_COLOR }}>第一象限: 重要且紧急，优先解决</p>
          <p className='top-info-p' style={{ backgroundColor: URGENT_COLOR }}>第二象限: 不重要紧急，给别人做</p>
          <p className='top-info-p' style={{ backgroundColor: NORMAL_COLOR }}>第三象限: 不重要不紧急，有空再说</p>
          <p className='top-info-p' style={{ backgroundColor: IMPORTANT_COLOR }}>第四象限: 重要不紧急，制定计划去做</p>
        </div>
      ),
      onOk() {},
    });
  }

  function typeChange(value) {
    dispatch({ type: 'DT_CHANGE', dttype: dateType2Num(value), dt: state.dt });
  }

  function dtChange(value) {
    dispatch({ type: 'DT_CHANGE', dttype: state.dttype, dt: value });
  }

  useEffect(() => {
    dttype4Add.current = dateType2Num(type4Add);
  }, [type4Add]);

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

  return (
    <div className='top-date'>
      <Space>
        <Select value={num2DateType(state.dttype)} onChange={typeChange}>
          <Option value="date">日</Option>
          <Option value="week">周</Option>
          <Option value="month">月</Option>
          <Option value="year">年</Option>
        </Select>
        <DatePicker allowClear={false} picker={num2DateType(state.dttype)} onChange={dtChange} value={state.dt} />
      </Space>
      
      <div className="top-info" >
        <Button shape="circle" style={{ marginRight: 10 }} icon={<PlusOutlined />} size='small' onClick={showModal} />
        <Button shape="circle" icon={<InfoOutlined />} size='small' onClick={info} />
      </div>

      <Modal title="新建" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Space direction="vertical">
          <Space>
            <Select value={type4Add} onChange={setType4Add}>
              <Option value="date">日</Option>
              <Option value="week">周</Option>
              <Option value="month">月</Option>
              <Option value="year">年</Option>
            </Select>
            <DatePicker allowClear={false} picker={type4Add} onChange={value => setDt4Add(value)} value={dt4Add} />
          </Space>
          <Space size={0}>
            <button className='top-button' style={getButtonStyle(1)} onClick={() => setQuadrant(1)}>重要紧急</button>
            <button className='top-button' style={getButtonStyle(2)} onClick={() => setQuadrant(2)}>不重要但紧急</button>
            <button className='top-button' style={getButtonStyle(3)} onClick={() => setQuadrant(3)}>不重要不紧急</button>
            <button className='top-button' style={getButtonStyle(4)} onClick={() => setQuadrant(4)}>重要不紧急</button>
          </Space>
          <Input placeholder="添加任务摘要" value={title4Add} onChange={e => setTitle4Add(e.target.value)} />
          <TextArea placeholder="添加任务详情" showCount maxLength={500} rows={4} value={detail4Add} onChange={e => setDetail4Add(e.target.value)} />
        </Space>    
      </Modal>
    </div>
  );
}