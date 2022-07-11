import Database from './data'
import app from './app'
import cron from './cron'

Database.init()
cron.init()

app.listen()
  .then(({ url }) => { console.log(`🚀  Server ready at ${url}`) })
  .catch(err => { console.log('❌ Failed to start server', err) })
