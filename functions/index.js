const functions = require('firebase-functions');
const projectId = process.env.GCLOUD_PROJECT || 'xyz';
const cors = require('cors')({origin:true})
const fetch = require('node-fetch');
const json2xls = require('json2xls');
const path = require('path');
const os = require('os');
const fs = require('fs');
const util = new (require('./utils/index'))()
// const cron = new (require('./crons/index'))(util)
const {serviceAccount, bigquery, storage, bucket, admin} = util.firebaseSetup(projectId);
const firestoredb = admin.firestore();
// new (require('./prodOnly/index'))(exports, functions, projectId, firestoredb, cron).deploy()
// const reports = new (require('./reports/index'))(firestoredb, bucket)

exports.helloWorld = functions.https.onRequest((request, response) => {
  let id_val = request.query.id;
  response.send({id:id_val,name:'john doe'});
 });

exports.helloWorldPost = functions.https.onRequest((request, response) => {
 let id_val = request.body.id;
 response.send({id:id_val,name:'john doe'});
 });

exports.addCovidPatient = functions.https.onRequest((request, response) => {
  // cors(req, res, () => {
   let body = request.body.name;
   let {name, tehsil, village, age, date, category} = body;
   let uId = util.uuidv4()
   firestoredb.collection('patients/doc/'+tehsil).doc(uId).set({name, tehsil, village, age, category, uId, date})
   .then((data)=>{
     response.send({data:'done'});
   })
   .catch((e)=>{
     response.send({data:'error', error:e});
   })
  // })
 });


exports.getServerTime = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    let date = req.query.date;
    let startTime = new Date(date).setHours(0, 0, 0, 0);
    let endTime = new Date(date).setHours(23, 59, 59, 59);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({status:'success', startTime: startTime, endTime: endTime, time: (new Date).getTime(), date: new Date()});
  });
});

exports.downloadExpenses = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    console.log('anp downloadExpenses');
    res.setHeader('Content-Type', 'application/json');
    reports.getExpensesData().then((data)=>{
      return res.status(200).send(data);
    }).catch((err)=>{
      console.log(err);
    })
  });
});
