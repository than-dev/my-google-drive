import fs from 'fs/promises'
import prettyBytes from 'pretty-bytes'

export class FileHelper {
    static async getFileStatus(downloadsFolder) {
        const currentFiles = await fs.readdir(downloadsFolder)
        const statuses = await Promise
            .all(
                currentFiles
                    .map(
                        file => fs.promises.stat(`${downloadsFolder}/${file}`)
                    )
            )
        let filesStatuses = []
        for (const fileIndex in currentFiles) {
            const { birthtime, size } = statuses[fileIndex]
            filesStatuses.push({
                size: prettyBytes(size),
                file: currentFiles[fileIndex],
                lastModified: birthtime,
                owner: process.env.USER
            })
        }

        return filesStatuses
    }
}