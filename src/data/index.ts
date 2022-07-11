import 'dotenv/config'
import { Pool } from 'pg'

class Database {
  private pool: Pool
  private graph: Pool

  init (): void {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_STRING
    })

    this.graph = new Pool({
      connectionString: process.env.GRAPH_DATABASE_STRING
    })
  }

  async query<T>(queryString: string): Promise<T[]> {
    const client = await this.pool.connect()

    const res: { rows: T[] } = await client.query(queryString)

    client.release()

    return res.rows
  }

  async graphQuery<T>(queryString: string): Promise<T[]> {
    const client = await this.graph.connect()

    const res: { rows: T[] } = await client.query(queryString)

    client.release()

    return res.rows
  }
}

export default new Database()
