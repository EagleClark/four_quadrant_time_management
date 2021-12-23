import moment from 'moment';

export function dateType2Num(type) {
  switch (type) {
    case 'date':
      return 1;
    case 'week':
      return 2;
    case 'month':
      return 3;
    case 'year':
      return 4;
    default:
      return 1;
  }
}

export function num2DateType(type) {
  switch (type) {
    case 1:
      return 'date';
    case 2:
      return 'week';
    case 3:
      return 'month';
    case 4:
      return 'year';
    default:
      return 'date';
  }
}

export function num2DateTypeZh(type) {
  switch (type) {
    case 1:
      return '日';
    case 2:
      return '周';
    case 3:
      return '月';
    case 4:
      return '年';
    default:
      return '日';
  }
}

export function SQLResultSetRowList2Arr(list) {
  const arr = [];
  for (let i = 0; i < list.length; i++) {
    arr.push(list[i]);
  }

  return arr;
}

export function quadrant2Text(quadrant) {
  switch (quadrant) {
    case 1:
      return '重要且紧急';
    case 2:
      return '不重要但紧急';
    case 3:
      return '不重要不紧急';
    case 4:
      return '重要但不紧急';
    default:
      return '';
  }
}

export function dtFormat(dt, dttype) {
  console.log(`${moment(dt).format("YYYY年第ww周")}`)
  switch (dttype) {
    case 1:
      return moment(dt).format("YYYY年MM月DD日");
    case 2:
      return `${moment(dt).format("YYYY年第ww周")}`;
    case 3:
      return moment(dt).format("YYYY年MM月");
    case 4:
      return moment(dt).format("YYYY年");
    default:
      return moment(dt).format("YYYY年MM月DD日");
  }
}