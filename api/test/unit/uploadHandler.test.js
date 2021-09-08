import {
    describe,
    test,
    expect,
    jest
} from '@jest/globals';
import { resolve } from 'path';
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
        it('should save a stream on disk when given it', async () => {
            const chunks = ['hey', 'dude']
            const downloadsFolder = '/tmp'
            const handler = new UploadHandler({
                io: ioObj,
                socketId: '01',
                downloadsFolder
            })

            const onData = jest.fn()

            jest.spyOn(fs, fs.createWriteStream.name).mockImplementation(() => TestUtil.generateWritableStream(onData))

            const onTransform = jest.fn()
            
            jest.spyOn(handler, handler.handleFileBytes.name).mockImplementation(() => TestUtil.generateTransformStream(onTransform))

            const params = {
                fieldname: 'video',
                file: TestUtil.generateReadableStream(chunks),
                filename: 'mockFile.mov'
            }

            await handler.onFile(...Object.values(params))

            expect(onData.mock.calls.join()).toEqual(chunks.join())

            expect(onTransform.mock.calls.join()).toEqual(chunks.join())

            const expectFilename = resolve(handler.downloadsFolder, params.filename) 

            expect(fs.createWriteStream).toHaveBeenCalledWith(expectFilename)

        })
    })
})