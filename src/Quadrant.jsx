import Item from "./Item";
import './css/Quadrant.css';
import { IMPORTANT_COLOR, NORMAL_COLOR, URGENT_COLOR, URGENT_IMPORTANT_COLOR } from "./js/Constant";

export default function Quadrant(props) {
  const { quadrant, data } = props;

  const style = {
    backgroundColor: getColor(quadrant),
  }

  return (
    <div className='outer' style={style}>
      {data.length > 0 && <div className='todo'>待完成: {data.length}</div>}
      <div className='inner'>
        {data.map(v => <Item key={v.key} itemInfo={v} />)}
      </div>
    </div>
  );
}

function getColor(quadrant) {
  switch (quadrant) {
    case 1:
      return URGENT_IMPORTANT_COLOR;
    case 2:
      return URGENT_COLOR;
    case 3:
      return NORMAL_COLOR;
    case 4:
      return IMPORTANT_COLOR;
    default:
      return NORMAL_COLOR;
  }
}