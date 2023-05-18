import { BufferDataWriter } from "../requests/abstract_request"
import { RawPublishConfirmResponse } from "./raw_response"
import { Response } from "./response"

export class PublishConfirmResponse implements Response {
  static key = 0x0003
  public publishingIds: bigint[]
  private publisherId: number
  constructor(private response: RawPublishConfirmResponse) {
    if (this.response.key !== PublishConfirmResponse.key) {
      throw new Error(`Unable to create ${PublishConfirmResponse.name} from data of type ${this.response.key}`)
    }
    this.publishingIds = response.publishingIds
    this.publisherId = response.publisherId
  }

  toBuffer(): Buffer {
    const dw = new BufferDataWriter(Buffer.alloc(1024), 4)
    dw.writeUInt16(PublishConfirmResponse.key)
    dw.writeUInt16(1)
    dw.writeUInt8(this.publisherId)
    dw.writeUInt32(this.publishingIds.length)
    for (const pubId of this.publishingIds) {
      dw.writeUInt64(pubId)
    }
    dw.writePrefixSize()
    return dw.toBuffer()
  }

  get key() {
    return this.response.key
  }

  get correlationId(): number {
    return -1
  }

  get code(): number {
    return -1
  }

  get ok(): boolean {
    return true
  }
}