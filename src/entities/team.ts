class Team {
  id: string
  name: string
  acro: string
  city: string
  country: string

  constructor (init: Partial<Team>) {
    Object.assign(this, init)
  }
}

export default Team
