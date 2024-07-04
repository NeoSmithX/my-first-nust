

import db from './init'; // Assuming db.js is in the same directory
import type { RowDataPacket} from 'mysql2';
import type { OkPacket } from 'mysql2';
import type { InputFetch, ReturnFetch } from './types/interface';

export default defineEventHandler(async (event) => {
    const returnFetch: ReturnFetch = {
      status: false,
      dataArray: []
    };
  
    const body = await readBody(event) as InputFetch;
    const { collectionName: tableName, rowData, docId } = body;
  
    try {
      if (docId) {
        // Update query
        const [result] = await db.query<OkPacket>(`UPDATE ?? SET ? WHERE id = ?`, [tableName, rowData, docId]);
        if (result.affectedRows > 0) {
          console.log(`Document with ID ${docId} updated successfully.`);
          returnFetch.status = true;
        } else {
          console.log(`No document found with ID ${docId}, or no new data to update.`);
        }
    } else {
        // Insert query
        const [result] = await db.query<OkPacket>(`INSERT INTO ?? SET ?`, [tableName, rowData]);
        if (result.insertId) {
            console.log(`New document added with ID ${result.insertId}.`);
            returnFetch.status = true;
            returnFetch.dataArray.push({ docId: result.insertId, rowData: rowData as RowDataPacket | RowDataPacket[] });
        }
    }
    } catch (error) {
      console.error('Database error:', error);
      // Handle your database errors here
    }
  
    return returnFetch;
  });