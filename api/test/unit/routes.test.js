import { Routes } from '../../src/routes.js';
import { jest } from '@jest/globals';

describe('Routes', () => {
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

        it('should call defaultRoute if given an inexistent route', async () => {
            const routes = new Routes()
            const params = {
                ...defaultParams
            }

            params.req.method = 'inexistent'
            routes.handler(...params.values())
            expect(params.res.end).toHaveBeenCalledWith('hello world')
        })

        it('should call post if given a method === POST', async () => {
             const routes = new Routes()
            const params = {
                ...defaultParams
            }

            params.req.method = 'POST'
            routes.handler(...params.values())
            expect(params.res.end).toHaveBeenCalledWith('hello world')
        })

        it('should call options if given a method === OPTIONS', async () => {
             const routes = new Routes()
            const params = {
                ...defaultParams
            }

            params.req.method = 'OPTIONS'
            await routes.handler(...params.values())
            expect(params.res.writeHead).toHaveBeenCalledWith(204)
            expect(params.res.writeHead).toHaveBeenCalled()
        })

        it('should call get if given a method === GET', async () => {
             const routes = new Routes()
            const params = {
                ...defaultParams
            }

            params.req.method = 'GET'
            await routes.handler(...params.values())
            expect(params.res.end).toHaveBeenCalledWith('hello world')
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
})