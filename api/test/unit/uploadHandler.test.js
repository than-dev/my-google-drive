import {
    describe,
    it,
    expect,
    jest,
    beforeEach
} from '@jest/globals';
import { resolve } from 'path';
import fs from 'fs';
import { logger } from '../../src/logger.js';
import { pipeline } from 'stream/promises';
import { UploadHandler } from '../../src/uploadHandler.js';
import { TestUtil } from '../utils/testUtil.js';

describe('Upload Handler', () => {
    const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => { }
    }

    beforeEach(() => {
        jest.spyOn(logger, 'info').mockImplementation()
    })

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

    describe('Handle File Bytes', () => {
        it('should call emit function and it is a transform stream', async () => {
            const handler = new UploadHandler({
                io: ioObj,
                socketId: '01'
            })
            
            jest.spyOn(ioObj, ioObj.to.name)
            jest.spyOn(ioObj, ioObj.emit.name)
            jest.spyOn(handler, handler.canExecute.name).mockReturnValueOnce(true)

            const messages = ['hello']
            const source = TestUtil.generateReadableStream(messages)

            const onWrite = jest.fn()
            const target = TestUtil.generateWritableStream(onWrite)

            await pipeline(
                source,
                handler.handleFileBytes('filename.txt'),
                target
            )

            expect(ioObj.to).toHaveBeenCalledTimes(messages.length)
            expect(ioObj.emit).toHaveBeenCalledTimes(messages.length)

            // if handleFileBytes be a transform stream, our pipeline will continue the process, passing data to straight and call our function at target to all chunks
            expect(onWrite).toBeCalledTimes(messages.length)
            expect(onWrite.mock.calls.join()).toEqual(messages.join())
        })

        // it('should emit only one message during 2 seconds period', async () => {
        //     const spiedEmit = jest.spyOn(ioObj, ioObj.emit.name)

        //     const day = '2021-09-08 00:00'
        //     // Date.now do this.lastMessages em handleBytes
        //     const onFirstLastMessageSent = TestUtil.getTimeFromDate(`${day}:00`)
            
        //     // -> hello arrived
        //     const onFirstCanExecute = TestUtil.getTimeFromDate(`${day}:02`)
        //     const onSecondUpdateLastMessageSent = onFirstCanExecute

        //     // -> hey is out window time
        //     const onSecondCanExecute = TestUtil.getTimeFromDate(`${day}:03`)

        //     // -> world arrived
        //     const onThirdCanExecute = TestUtil.getTimeFromDate(`${day}:04`)

        //     TestUtil.mockDateNow(
        //         [
        //             onFirstLastMessageSent,
        //             onFirstCanExecute,
        //             onSecondUpdateLastMessageSent,
        //             onSecondCanExecute,
        //             onThirdCanExecute
        //         ]
        //     )

        //     const messages = ['hello', 'hey', 'world']
        //     const filename = 'filename.avi'
        //     const expectMessagesSent = 2
        //     const messageTimeDelay = 2000

        //     const source = TestUtil.generateReadableStream(messages)
        //     const handler = new UploadHandler({
        //         messageTimeDelay,
        //         io: ioObj,
        //         socketId: '01'
        //     })

        //     await pipeline(
        //         source,
        //         handler.handleFileBytes(filename)
        //     )

        //     expect(ioObj.emit).toHaveBeenCalledTimes(expectMessagesSent)
            
        //     const [firstCallResult, secondCallResult] = ioObj.emit.mock.calls
            
        //     expect(firstCallResult).toEqual([handler.ON_UPLOAD_EVENT, { alreadyProcessed: 'hello'.length, filename }])
        //     expect(secondCallResult).toEqual([handler.ON_UPLOAD_EVENT, { alreadyProcessed: messages.join('').toString().length, filename }])
        // })
    })

    describe('Can Execute', () => {
        it('should return true when time is later then specified delay', () => {
            const timerDelay = 1000

            const uploadHandler = new UploadHandler({
                io: {},
                socketId: '',
                messageTimeDelay: timerDelay
            })
            
            const now = TestUtil.getTimeFromDate('2021-08-09 00:00:03')
            TestUtil.mockDateNow([now])

            const lastExecution = TestUtil.getTimeFromDate('2021-08-09 00:00:00')

            const result = uploadHandler.canExecute(lastExecution)
            expect(result).toBeTruthy()
        })

        it('should return false when time is not later than specified delay', () => {
            const timerDelay = 3000

            const uploadHandler = new UploadHandler({
                io: {},
                socketId: '',
                messageTimeDelay: timerDelay
            })
            
            const now = TestUtil.getTimeFromDate('2021-08-09 00:00:01')
            TestUtil.mockDateNow([now])

            const lastExecution = TestUtil.getTimeFromDate('2021-08-09 00:00:00')

            const result = uploadHandler.canExecute(lastExecution)
            expect(result).toBeFalsy()
        })
    })
})