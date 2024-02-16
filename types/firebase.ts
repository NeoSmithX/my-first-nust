
export type InputFetch = {
    collectionName:string,
    docId?:string,
    rowData?:object
}

export type ReturnFetch = {
    status:boolean
    log?:string
    dataArray:{
        docId:string
        rowData:object
    }[]
    
}

