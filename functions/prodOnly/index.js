module.exports = class ProdOnly {
  constructor(xporter, functions, projectId, firestoredb, cron){
    this.functions = functions
    this.projectId = projectId
    this.firestoredb = firestoredb
    this.cron = cron
    this.exports = xporter
    this.projectIdProd = 'coronaquit'
  }

  deployLastCronOfTheDay(){
    if(this.projectId === this.projectIdProd){
      this.exports.lastCronOfTheDay = this.functions.pubsub.schedule('55 23 * * *')
      .timeZone('Asia/Kolkata')
      .onRun((context) => {
          return this.cron.functionName(this.firestoredb, this.firestoredb, 'fullday')
      });
    }
  }

  deploy(){
    this.deployLastCronOfTheDay()
  }
}
