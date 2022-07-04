import 'dotenv/config'
import jwt from 'jsonwebtoken'

class Jwt {
  sign (): string {
    const token = jwt.sign({}, process.env.JWT_SECRET)
    return token
  }

  async decode (token: string): Promise<boolean> {
    let error: boolean | undefined

    await new Promise<void>((resolve) => {
      jwt.verify(token, process.env.JWT_SECRET, (err) => {
        if (err) { error = true }
        resolve()
      })
    })

    return error
  }
}

export default new Jwt()
