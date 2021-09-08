import { read } from 'fs';
import { Readable } from 'stream';

export class TestUtil {
    static generateReadableStream(data) {
        return new Readable({
            objectMode: true,
            async read() {
                for (const item of data) {
                    this.push(item)
                }

                this.push(null)
            }
        })
    }
}