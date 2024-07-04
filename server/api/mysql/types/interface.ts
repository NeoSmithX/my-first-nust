import type { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2';

export interface ReturnFetch {
    status: boolean;
    dataArray: Array<{ docId: number | string; rowData: RowDataPacket | RowDataPacket[] }>;
    log?: string;
  }
  
export  interface InputFetch {
    collectionName: string;
    rowData?: Record<string, any>;
    docId?: number | string;
  }
  