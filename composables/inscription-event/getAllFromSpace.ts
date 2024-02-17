import fetchData from '../firebase/fetch-data'
type ReturnGet ={
    docId:string,
    rowData:object,
}
const getAllFromSpace = async (collectionName:string,space:string): Promise<ReturnGet[]> =>{
    const returnData:ReturnGet[] = []
    const data = await fetchData({collectionName:collectionName,rowData:{space:space}})
    data.dataArray.forEach((doc)=>{
        if ('space' in doc.rowData){
            if (doc.rowData.space === space){
                returnData.push(
                    {
                        docId:doc.docId,
                        rowData:doc.rowData
                    }
                )
            }
            
        }
        
    })
    const x:any= []
    return x
}
export default getAllFromSpace