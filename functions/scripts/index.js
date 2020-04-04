const functions = require('firebase-functions');
const json2csv = require('json2csv').parse;
const projectId = 'coronaquit';
const util = new (require('../utils/index'))()
const cron = new (require('../crons/index'))(util)

const {serviceAccount, bigquery, storage, bucket, admin} = util.firebaseSetup(projectId);

const firestoredb = admin.firestore();
const cors = require('cors')({origin:true})
const fetch = require('node-fetch');
const json2xls = require('json2xls');
const path = require('path');
const os = require('os');
const fs = require('fs');
const reports = new (require('../reports/index'))(firestoredb, bucket);
function uuidv4() {
  let x = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  return Math.floor(new Date() / 1000)+"-"+ x;
}


function writeInDev(collection, doc, data){
  let devdb = util.initializeDevFirestore()
  devdb.collection(collection).doc(doc).set(data)
}
