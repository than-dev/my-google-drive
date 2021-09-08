import { read } from 'fs';
import { Readable, Writable } from 'stream';

export class TestUtil {
    static generateReadableStream(data) {
        return new Readable({
            objectMode: true,
            read() {
                for (const item of data) {
                    this.push(item)
                }

                this.push(null)
            }
        })
    }

       static generateWritableStream(onData) {
        return new Writable({
            objectMode: true,
            write(chunk, encoding, cb) {
                onData(chunk)

                cb(null, chunk)
            }
        })
    }
}