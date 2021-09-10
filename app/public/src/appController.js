export class AppController {
    constructor({ connectionManager, viewManager, dragAndDropManager }) {
        this.connectionManager = connectionManager
        this.viewManager = viewManager
        this.dragAndDropManager = dragAndDropManager

        this.uploadFiles = new Map()
    }

    async initialize() {
        this.viewManager.configureFileBtnClick()
        this.viewManager.configureModal()
        this.viewManager.configureOnFileChange(this.onFileChange.bind(this))
        this.dragAndDropManager.initialize({
            onDropHandler: this.onFileChange.bind(this)
        })

        this.connectionManager.configureEvents({
            onProgress: this.onProgress.bind(this)
        })
        
        await this.updateCurrentFiles()
    }

    async onProgress({ processedAlready, filename }) {
        const file = this.uploadFiles.get(filename)
        const alreadyProcessed = Math.ceil(processedAlready / file.size * 100)
        this.updateProgress(file, alreadyProcessed)

        if (alreadyProcessed < 98) return

        return this.updateCurrentFiles()
    }

    updateProgress(file, percent) {
        const uploadingFiles = this.uploadFiles
        file.percent = percent

        const total = [...uploadingFiles.values()]
            .map(({ percent }) => percent ?? 0)
            .reduce((total, current) => total + current, 0)
        
        this.viewManager.updateModalStatus(total)
    }
    

    async onFileChange(files) {
        // here has a famous bug, if in upload you do another upload, it will close the modal and init from zero
        this.uploadFiles.clear()
        
        this.viewManager.openModal()
        this.viewManager.updateModalStatus(0)

        const requests = []
        
        for (const file of files) {
            this.uploadFiles.set(file.name, file)
            requests.push( this.connectionManager.uploadFile(file))
        }

        await Promise.all(requests)
        this.viewManager.updateModalStatus(100)

        setTimeout(() => this.viewManager.closeModal(), 1000)

        await this.updateCurrentFiles()
    }

    async updateCurrentFiles() {    
        const files = await this.connectionManager.currentFiles()
        console.log(files);
        this.viewManager.updateCurrentFiles(files)
    }
}