import Quadrant from "./jsx/Quadrant";
import Top from "./jsx/Top";
import './css/App.css';
import { useEffect, useReducer, useState } from "react";
import { AppContext } from './js/Context';
import dataReducer from './js/DataReducer';
import Database from "./js/Database";
import moment from 'moment';
import { SQLResultSetRowList2Arr } from "./js/Utils";

function App() {
  const [state, dispatch] = useReducer(dataReducer, { items: [], dttype: 1, dt: moment(), });
  const [randomKey, setRandomKey] = useState(Math.random());

  useEffect(() => {
    const promise = Database.getItemsByDt(state.dttype, state.dt);
    promise.then(items => {
      dispatch({ type: 'INIT', payload: SQLResultSetRowList2Arr(items) });
    });
  }, [randomKey, state.dt, state.dttype]);

  return (
    <AppContext.Provider value={{ state, Database, dispatch, setRandomKey }}>
      <div className="App">
        <Top />
        <div className="row">
          <Quadrant quadrant={2} data={state.items.filter(v => v.quadrant === 2)} />
          <Quadrant quadrant={1} data={state.items.filter(v => v.quadrant === 1)} />
        </div>
        <div className="row">
          <Quadrant quadrant={3} data={state.items.filter(v => v.quadrant === 3)} />
          <Quadrant quadrant={4} data={state.items.filter(v => v.quadrant === 4)} />
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
