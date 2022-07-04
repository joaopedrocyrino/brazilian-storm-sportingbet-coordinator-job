export interface CreateMatch {
  championshipId: string
  houseId: string
  visitorId: string
  start: string
  end: string
  token: string
}

export interface FullfillResults {
  id: string
  house: number
  visitor: number
  token: string
}
