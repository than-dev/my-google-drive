import {
    describe,
    test,
    expect,
    jest
} from '@jest/globals';
import { Routes } from '../../src/routes.js';
import { UploadHandler } from '../../src/uploadHandler.js';

describe('Upload Handler', () => {
    const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => {}
    }

    describe('Register Events', () => {
        it('should call onFile and onFinish on Busboy instance', async () => {
            const uploadHandler = new UploadHandler({
                io: ioObj,
                socketId: '01'
            })

            jest.spyOn(uploadHandler, uploadHandler.onFile.name).mockResolvedValue()

            const headers = {
                'content-type': 'multipart/form-data; boundary='
            }
            const fn = jest.fn()
            uploadHandler.registerEvents(headers, fn)

            expect(uploadHandler.onFile).toHaveBeenCalled()
            expect(fn).toHaveBeenCalled()
        })
    })
})