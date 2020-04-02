const os = require('os')
const path = require('path')
const fs = require('fs')
const json2xls = require('json2xls')

module.exports = class Reports{
  constructor(readdb, bucket){
    this.readdb = readdb
    this.bucket = bucket
  }
  getDatesRange(from, to){
    let result=[]
    for(let dt = from; dt<=to; dt.setDate(dt.getDate()+1)){
        result.push(new Date(dt).toISOString().split('T')[0]);
    }
    return result;
  }

  uploadDataToBucket(data, filename){
    filename = filename + '-'+ (new Date()/1)
    let reportsUploadFolder = '/backup_csv/'

    console.log('anp data', data);
    if(!data.length){ return 'no data found, please try again'}
    return new Promise((resolve, reject)=>{
              let xls = json2xls(data);
              const tempFilePath = path.join(os.tmpdir(), filename+'.xlsx');
              fs.writeFileSync(tempFilePath, xls, 'binary');
              fs.chmodSync(tempFilePath, 0o777);
              resolve(tempFilePath);
          })
          .then((tempFilePath) => {
            return this.bucket.upload(tempFilePath, { destination: reportsUploadFolder+filename+'.xlsx' });
          }).then(() => {
            const thumbFile = this.bucket.file(reportsUploadFolder+filename+'.xlsx');
            const config = { action: "read", expires: "03-01-2500", };
            return thumbFile.getSignedUrl(config)
          }).then((results) => {
            const thumbResult = results[0];
            console.log('anp res', thumbResult);
            return {downloadPath:thumbResult};
        });
  }



  getExpensesData(){
    let collectionName = 'expenses'
    let p = this.readdb.collection(collectionName).get()
    .then((snapshot)=>{
      let data = []
      snapshot.forEach((doc)=>{
        data.push(doc.data())
      })
       return data
     })
     .then((data)=>{
       return this.uploadDataToBucket(data, 'expenses');
     })
     .catch((err)=>{
       console.log('anp err', err);
     })
     return p;
  }
  getStudentsData(){
    let collectionName = 'students'
    let p = this.readdb.collection(collectionName).get()
    .then((snapshot)=>{
      let data = []
      snapshot.forEach((doc)=>{
        data.push(doc.data())
      })
       return data
     })
     .then((data)=>{
       return this.uploadDataToBucket(data, 'students');
     })
     .catch((err)=>{
       console.log('kv err', err);
     })
     return p;
  } 
   getReceiptsData(){
    let collectionName = 'college_receipt'
    let p = this.readdb.collection(collectionName).get()
    .then((snapshot)=>{
      let data = []
      snapshot.forEach((doc)=>{
        data.push(doc.data())
      })
       return data
     })
     .then((data)=>{
       return this.uploadDataToBucket(data, 'college_receipt');
     })
     .catch((err)=>{
       console.log('kv err', err);
     })
     return p;
  }
}
