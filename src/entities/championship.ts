class Championship {
  id: string
  name: string
  season: number
  country: string
  closed: boolean
  inserted: boolean

  constructor (init: Partial<Championship>) {
    Object.assign(this, init)
  }
}

export default Championship
