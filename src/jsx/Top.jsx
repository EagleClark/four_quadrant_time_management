import { useRef, useContext } from 'react';
import { DatePicker, Select, Space, Modal, Button } from 'antd';
import { InfoOutlined, PlusOutlined } from '@ant-design/icons';
import '../css/Top.css';
import { IMPORTANT_COLOR, NORMAL_COLOR, URGENT_COLOR, URGENT_IMPORTANT_COLOR } from '../js/Constant';
import { dateType2Num, num2DateType } from '../js/Utils';
import { AppContext } from '../js/Context';
import ItemPop from './ItemPop';

const { Option } = Select;

export default function Top() {
  const ctx = useContext(AppContext);
  const { state, dispatch } = ctx;

  const popRef = useRef();

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
      onOk() { },
    });
  }

  function typeChange(value) {
    dispatch({ type: 'DT_CHANGE', dttype: dateType2Num(value), dt: state.dt });
  }

  function dtChange(value) {
    dispatch({ type: 'DT_CHANGE', dttype: state.dttype, dt: value });
  }

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
        <Button shape="circle" style={{ marginRight: 10 }} icon={<PlusOutlined />} size='small' onClick={() => { popRef.current.showModal() }} />
        <Button shape="circle" icon={<InfoOutlined />} size='small' onClick={info} />
      </div>

      <ItemPop mode='add' ref={popRef} />
    </div>
  );
}