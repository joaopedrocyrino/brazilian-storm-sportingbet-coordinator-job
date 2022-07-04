import 'dotenv/config'
import * as crypto from 'crypto'
import { buildBabyjub, buildPoseidon, buildEddsa } from 'circomlibjs'
import createBlakeHash from 'blake-hash'
import ff from 'ffjavascript'
import { groth16 } from 'snarkjs'

class ZK {
  public privKey: bigint
  public pubKey: Uint8Array[]
  private poseidon: any
  private eddsa: any

  constructor () {
    this.init()
      .catch(() => {})
  }

  private async init (): Promise<void> {
    this.poseidon = await buildPoseidon()
    this.eddsa = await buildEddsa()

    this.privKey = await this.genPrivKey(
      process.env.COORDINATOR_USERNAME,
      process.env.COORDINATOR_PASSWORD
    )

    this.pubKey = this.genPubKey()
  }

  async hashPoseidon (el: any[]): Promise<bigint> {
    const F = this.poseidon.F
    return F.toObject(this.poseidon(el))
  }

  async hashHex (secret: string): Promise<bigint> {
    return await this.hashPoseidon([
        `0x${crypto.createHash('sha512').update(secret).digest('hex')}`
    ])
  }

  private async genPrivKey (username: string, password: string): Promise<bigint> {
    const usernameHash = await this.hashHex(username)
    const passwordHash = await this.hashHex(password)

    return await this.hashPoseidon([usernameHash, passwordHash])
  }

  private genPubKey (): Uint8Array[] {
    return this.eddsa.prv2pub(this.privKey.toString())
  }

  async genEcdhSharedKey (pubKey: Uint8Array[]): Promise<bigint> {
    const babyJub = await buildBabyjub()

    return this.buf2Bigint(
      babyJub.mulPointEscalar(pubKey, this.formatPrivKey())[0]
    )
  }

  private buf2Bigint (buf: ArrayBuffer | TypedArray | Buffer): bigint {
    let bits = 8n
    if (ArrayBuffer.isView(buf)) bits = BigInt(buf.BYTES_PER_ELEMENT * 8)
    else buf = new Uint8Array(buf)

    let ret = 0n
    for (const i of (buf as TypedArray | Buffer).values()) {
      const bi = BigInt(i)
      ret = (ret << bits) + bi
    }
    return ret
  }

  private formatPrivKey (): any {
    const sBuff = this.eddsa.pruneBuffer(
      createBlakeHash('blake512')
        .update(Buffer.from(this.privKey.toString()))
        .digest()
        .slice(0, 32)
    )
    const s = ff.utils.leBuff2int(sBuff)
    return ff.Scalar.shr(s, 3)
  }

  async decrypt (
    ciphertext: bigint,
    secret: bigint
  ): Promise<bigint> {
    const { publicSignals } = await groth16.fullProve(
      { ciphertext, secret },
      '../decrypt.wasm',
      '../decrypt.zkey'
    )

    const editedPublicSignals = this.unstringifyBigInts(publicSignals)

    return BigInt(editedPublicSignals[0])
  }

  private unstringifyBigInts (o: string | any[] | { [k: string]: any }): any {
    if (o) {
      if (
        typeof o === 'string' &&
        (/^[0-9]+$/.test(o) || /^0x[0-9a-fA-F]+$/.test(o))
      ) {
        return BigInt(o)
      } else if (Array.isArray(o)) {
        return o.map(this.unstringifyBigInts)
      } else if (typeof o === 'object') {
        const res: { [k: string]: any } = {}
        const keys = Object.keys(o)
        keys.forEach((k) => {
          res[k] = this.unstringifyBigInts(o[k])
        })
        return res
      } else {
        return o
      }
    } else {
      return null
    }
  }
}

export default new ZK()

type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array
