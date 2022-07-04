import 'dotenv/config'
import cron from 'node-cron'

import { Jwt } from '../frameworks'
import ChampionshipService from '../services/championship'
import MatchService from '../services/match'

class CronJob {
  init (): void {
    cron.schedule('0 2 * * *', async () => {
      const token = Jwt.sign()

      await ChampionshipService.insertChampionships(token)
      await MatchService.insertMatches(token)
      await MatchService.fullfillAndClose(token)
    }, { timezone: 'America/Sao_Paulo' }).start()
  }
}

export default new CronJob()
