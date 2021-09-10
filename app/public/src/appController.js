export class AppController {
    constructor({ connectionManager, viewManager }) {
        this.connectionManager = connectionManager
        this.viewManager = viewManager
    }

    async initialize() {
        await this.updateCurrentFiles()
    }

    async updateCurrentFiles() {    
        const files = await this.connectionManager.currentFiles()
        console.log(files);
        this.viewManager.updateCurrentFiles(files)
    }
}