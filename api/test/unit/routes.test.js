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

        // it('should call post if method is === POST', async () => {
        //     const routes = new Routes()
        //     const postSpy = jest.spyOn('routes', 'post');

        //     const ioObj = {
        //         to: (id) => ioObj,
        //         emit: (event, message) => {}
        //     }

        //     expect(postSpy).toHaveBeenCalled()
        // })

        // it('should call options if method is === OPTIONS', async () => {
        //     const routes = new Routes()
        //     const postSpy = jest.spyOn('routes', 'post');

        //     const ioObj = {
        //         to: (id) => ioObj,
        //         emit: (event, message) => {}
        //     }

        //     expect(postSpy).toHaveBeenCalled()
        // })

        // it('should call get if method is === GET', async () => {
        //     const routes = new Routes()
        //     const postSpy = jest.spyOn('routes', 'post');

        //     const ioObj = {
        //         to: (id) => ioObj,
        //         emit: (event, message) => {}
        //     }

        //     expect(postSpy).toHaveBeenCalled()
        // })

        it('should set any request with CORS enabled', () => {
            const routes = new Routes()
            const params = {
                ...defaultParams
            }

            params.req.method = 'any'
            routes.handler(...params.values())
            expect(params.res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*')
        })
    })
})