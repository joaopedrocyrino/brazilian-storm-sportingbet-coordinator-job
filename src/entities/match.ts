class Match {
  id: string
  champId: string
  houseId: string
  visitorId: string
  houseGoals: number
  visitorGoals: number
  start: string
  end: string
  inserted: boolean
  fullfilled: boolean
  closed: boolean

  constructor (init: Partial<Match>) {
    Object.assign(this, init)
  }
}

export default Match
