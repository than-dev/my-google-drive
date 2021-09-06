import { Routes } from '../../src/routes.js';
import { jest } from '@jest/globals';
import fs from 'fs/promises';
import { FileHelper } from '../../src/fileHelper.js';

describe('FileHelper', () => {
    describe('GetFileStatus', () => {
        it('should return files statuses in correct format', async () => {
            const statMock = {
                dev: 2053,
                mode: 33204,
                nlink: 1,
                uid: 1000,
                gid: 1000,
                rdev: 0,
                blksize: 4096,
                ino: 957890,
                size: 37343,
                blocks: 80,
                atimeMs: 1630963679699.6453,
                mtimeMs: 1630963679163.6584,
                ctimeMs: 1630963679163.6584,
                birthtimeMs: 1630963679151.6587,
                atime: '2021-09-06T21:27:59.700Z',
                mtime: '2021-09-06T21:27:59.164Z',
                ctime: '2021-09-06T21:27:59.164Z',
                birthtime: '2021-09-06T21:27:59.152Z'
            }

            const mockUser = 'nathan'
            process.env.USER = mockUser
            const fileName = 'teste-img.jpg'

            jest.spyOn(fs, fs.stat.name).mockResolvedValue([ fileName ])

            jest.spyOn(fs, fs.readdir.name).mockResolvedValue(statMock)

            const fileHelper = new FileHelper()
            const result = await fileHelper.getFileStatus('/tmp')

            const expectResult = [
                {
                    size: '37 kb',
                    birthtime: statMock.birthtime,
                    owner: mockUser,
                    fileName
                }
            ]

            expect(fs.stat).toHaveBeenCalledWith(`/tmp/${fileName}`)
            expect(result).toMatchObject(expectResult)
        })
    })
})