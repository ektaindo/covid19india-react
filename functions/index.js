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
 let name = request.body.name;
 let tehsil = request.body.tehsil;
 let village = request.body.village;
 let age = request.body.age;
 let cat = request.body.category;
 response.send({data:'done'});
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
