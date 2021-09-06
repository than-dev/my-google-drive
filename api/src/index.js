import https from 'https';
import fs from 'fs';
import { logger } from './logger.js'

const PORT = process.env.PORT || 3000;
const localhostSSL = {
    key: fs.readFileSync('./certificates/key.pem'),
    cert: fs.readFileSync('./certificates/cert.pem')
}

const server = https.createServer(
    localhostSSL,
    (req, res) => {
        res.end('hello world')
    }
)


const startServer = () => {
    const { address, port } = server.address()
    logger.info(`app running at https://${address}:${port}`)
}


server.listen(PORT, startServer)