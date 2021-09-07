import { Routes } from '../../src/routes.js';
import { jest } from '@jest/globals';

describe('Routes', () => {
    const defaultParams = {
            req: {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                method: '',
                body: {}
            },
            res: {
                writeHead: jest.fn(),
                setHeader: jest.fn(),
                end: jest.fn()
            },
            values: () => Object.values(defaultParams)
    }

    describe('Set Socket', () => {
        it('should store io instance', () => {
            const routes = new Routes()
            const ioObj = {
                to: (id) => ioObj,
                emit: (event, message) => {}
            }

            routes.setSocketInstance(ioObj);
            expect(routes.io).toStrictEqual(ioObj);
        })
    })

    describe('Handler', () => {

        it('should call defaultRoute if given an inexistent route', async () => {
            const routes = new Routes()
            const params = {
                ...defaultParams
            }

            params.req.method = 'inexistent'
            await routes.handler(...params.values())
            expect(params.res.end).toHaveBeenCalledWith('hello world')
        })

        it('should call post if given method === POST', async () => {
             const routes = new Routes()
            const params = {
                ...defaultParams
            }

            params.req.method = 'POST'
            jest.spyOn(routes, routes.post.name).mockResolvedValue()

            await routes.handler(...params.values())
            expect(routes.post).toHaveBeenCalled()
        })

        it('should call get if given method === GET', async () => {
                const routes = new Routes()
            const params = {
                ...defaultParams
            }

            params.req.method = 'GET'
            jest.spyOn(routes, routes.get.name).mockResolvedValue()

            await routes.handler(...params.values())
            expect(routes.get).toHaveBeenCalled()
        })

        it('should call options if given method === OPTIONS', async () => {
             const routes = new Routes()
            const params = {
                ...defaultParams
            }

            params.req.method = 'OPTIONS'
            await routes.handler(...params.values())
            expect(params.res.writeHead).toHaveBeenCalledWith(204)
            expect(params.res.end).toHaveBeenCalled()
        })

        it('should set any request with CORS enabled', async () => {
            const routes = new Routes()
            const params = {
                ...defaultParams
            }

            params.req.method = 'any'
            await routes.handler(...params.values())
            expect(params.res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*')
        })
    })

    describe('Get', () => {
        it('should list all files downloaded if given method GET', async () => {
            const routes = new Routes()
            const params = {
                ...defaultParams
            }

            const fileStatusesMock = [
                {
                    size: '188 kB',
                    birthtime: '2021-09-03T20:56:28.443Z',
                    owner: 'nathan',
                    fileName: 'file.any'
                }
            ]

            jest.spyOn(routes.fileHelper, routes.fileHelper.getFilesStatus.name).mockResolvedValue(fileStatusesMock)

            params.req.method = 'GET'
            await routes.handler(...params.values())

            expect(params.res.writeHead).toHaveBeenCalledWith(200)
            expect(params.res.end).toHaveBeenCalledWith(JSON.stringify(fileStatusesMock))
        })
    })
})