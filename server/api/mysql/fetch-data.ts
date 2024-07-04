import { defineEventHandler, readBody } from 'h3';
import db from './init'; // Assuming db.js is in the same directory
import type { RowDataPacket} from 'mysql2';

import type { InputFetch, ReturnFetch } from './types/interface';

export default defineEventHandler(async (event) => {
  const returnFetch: ReturnFetch = {
    status: false,
    dataArray: []
  };

  const body = await readBody(event) as InputFetch;
  const tableName = body.collectionName;
  const rowData = body.rowData;
  const docId = body.docId;

  if (docId) {
    const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM ?? WHERE id = ?`, [tableName, docId]);
    if (rows.length > 0) {
      returnFetch.status = true;
      returnFetch.dataArray = rows.map(row => ({ docId: row.id, rowData: row }));
    } else {
      returnFetch.log = `No document found with ID ${docId}`;
    }
  } else {
    if (!rowData) {
      returnFetch.log = 'No rowData provided';
      return returnFetch;
    }
    let sql = `SELECT * FROM ?? WHERE `;
    let conditions: string[] = [];
    let params: any[] = [tableName];
    for (const [key, value] of Object.entries(rowData)) {
      conditions.push(`${key} = ?`);
      params.push(value);
    }
    sql += conditions.join(' AND ');

    const [rows] = await db.query<RowDataPacket[]>(sql, params);
    if (rows.length > 0) {
      returnFetch.status = true;
      returnFetch.dataArray = rows.map(row => ({ docId: row.id.toString(), rowData: row }));
    }
  }

  return returnFetch;
});

  