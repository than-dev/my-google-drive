import { describe, it, expect, jest, beforeAll, afterAll } from '@jest/globals';
import fs from 'fs';
import { TestUtil } from '../utils/testUtil.js';
import FormData from 'form-data';
import { Routes } from '../../src/routes.js';
import { logger } from '../../src/logger.js';
import { tmpdir } from 'os';
import { join } from 'path';

describe('Routes Integration Test', () => {
	let defaultDownloadsFolder = '';

	beforeAll(async () => {
		defaultDownloadsFolder = await fs.promises.mkdtemp(join(tmpdir(), 'downloads-'))
	})

	afterAll(async () => {
		defaultDownloadsFolder = await fs.promises.rm(defaultDownloadsFolder, { recursive: true })
	})

	beforeEach(() => {
		jest.spyOn(logger, 'info').mockImplementation();
	});

	const ioObj = {
		to: (id) => ioObj,
		emit: (event, message) => {},
	};

	
	describe('Get File Status', () => {
		it('should upload file to the folder', async () => {
			const filename = 'teste-img.jpg';
			const fileStream = fs.createReadStream(
				`./test/integration/mocks/${filename}`
			);
			const response = TestUtil.generateWritableStream(() => {});

			const form = new FormData();
			form.append('photo', fileStream);

			const defaultParams = {
				req: Object.assign(form, {
					headers: form.getHeaders(),
					method: 'POST',
					url: '?socketId=10',
				}),
				res: Object.assign(response, {
					writeHead: jest.fn(),
					setHeader: jest.fn(),
					end: jest.fn(),
				}),
				values: () => Object.values(defaultParams),
			};

			const routes = new Routes(defaultDownloadsFolder)
			routes.setSocketInstance(ioObj)

			const dirBeforeRun = await fs.promises.readdir(defaultDownloadsFolder)
			expect(dirBeforeRun).toEqual([])

			await routes.handler(...defaultParams.values())
			
			const dirAfterRun = await fs.promises.readdir(defaultDownloadsFolder)
			expect(dirAfterRun).toEqual([filename])

			expect(defaultParams.res.writeHead).toHaveBeenCalledWith(200)
			
			const expectedResult = JSON.stringify({ result: 'Files uploaded with success' })
			
			expect(defaultParams.res.end).toHaveBeenCalledWith(expectedResult)
		});
	});
});
