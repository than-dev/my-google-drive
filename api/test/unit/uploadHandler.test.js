import {
    describe,
    test,
    expect,
    jest
} from '@jest/globals';
import fs from 'fs';
import { Routes } from '../../src/routes.js';
import { UploadHandler } from '../../src/uploadHandler.js';
import { TestUtil } from '../utils/testUtil.js';

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
            const onFinish = jest.fn()
            const busboyInstance = uploadHandler.registerEvents(headers, onFinish)
            
            const fileStream = TestUtil.generateReadableStream(['chunk', 'of', 'data'])

            busboyInstance.emit('file', 'fieldname', fileStream, 'filename.txt')

            busboyInstance.listeners('finish')[0].call()
            
            expect(uploadHandler.onFile).toHaveBeenCalled()
            expect(onFinish).toHaveBeenCalled()
        })
    })

    describe('On File', () => {
        it('should save a stream on disk when given', () => {
            const chunks = ['hey', 'dude']
            const downloadsFolder = '/tmp'
            const handler = new UploadHandler({
                io: ioObj,
                socketId: '01',
                downloadsFolder
            })

            const onData = jest.fn()

            jest.spyOn(fs, fs.createWriteStream.name).mockImplementation(() => TestUtil.generateWritableStream(onData))

        })
    })
})