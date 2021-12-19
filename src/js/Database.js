import moment from 'moment';

class Database {
  constructor() {
    this.tableName = 'PLAN_DATAS';
    this.db = openDatabase('db', '1.0', 'data', 2 * 1024 * 1024);
    this._init();
  }

  _init() {
    this.db.transaction(tx => {
      // key 唯一标识
      // dttype 日期类型：年、月、日
      // dt 日期
      // title 显示出来的标题
      // quadrant 所在象限
      // done 是否已完成
      // detail 详细信息
      let sql = `CREATE TABLE IF NOT EXISTS ${this.tableName} (`;
      sql += 'key INTEGER PRIMARY KEY AUTOINCREMENT, ';
      sql += 'dttype INT, ';
      sql += 'dt INT, ';
      sql += 'title TEXT, ';
      sql += 'quadrant INT, ';
      sql += 'done INT, ';
      sql += 'detail TEXT';
      sql += ')';
      tx.executeSql(sql);
    });
  }

  _executeSQL(sqlStr, args, field?) {
    const promise = new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          sqlStr,
          args,
          (tx, results) => { if (field) { resolve(results[field]) } else { resolve(results) }},
          (tx, error) => {reject(error)},
        );
      });
    });
    return promise;
  }

  addItem(itemData) {
    const sqlStr = `INSERT INTO ${this.tableName} (dttype, dt, title, quadrant, done, detail) VALUES (?, ?, ?, ?, ?, ?)`;
    return this._executeSQL(sqlStr, itemData, 'rowsAffected');
  }

  deleteItem(key) {
    return this._executeSQL(`DELETE FROM ${this.tableName} WHERE key = ?`, [key], 'rowsAffected');
  }

  getItemsByDt(dttype, dt) {
    let st, et;
    switch (dttype) {
      case 1:
        st = +moment(dt.format("YYYY-MM-DD"));
        et = st + 3600 * 24 * 1000 - 1;
        break;
      default:
        break;
    }

    const sqlStr = `SELECT * FROM ${this.tableName} WHERE dttype = ? AND dt >= ? AND dt <= ?`;
    return this._executeSQL(sqlStr, [dttype, st, et], 'rows');
  }

  getItemByKey(key) {
    return this._executeSQL(`SELECT * FROM ${this.tableName} WHERE key = ?`, [key], 'rows');
  }
}

export default new Database();