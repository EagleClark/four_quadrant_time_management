export default function dataReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, ...{ items: action.payload } };
    case 'DT_CHANGE':
      const { dttype, dt } = action;
      return { ...state, ...{ dttype, dt } };
    default:
      break;
  }
}