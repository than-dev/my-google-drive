export class DragAndDropManager {
    constructor() {
        this.dropArea = document.getElementById('drop-area')
        this.onDropHandler = () => {}
    }

    initialize({ onDropHandler }) {
        this.onDropHandler = onDropHandler
        this.disableDragNDropEvents()
        this.enableHighlightOnDrag()
        this.enableDrop()
    }

    setOnDropFn() {

    }

    disableDragNDropEvents() {
        const events = [
            'dragenter',
            'dragover',
            'dragleave',
            'drop'
        ]

        const preventDefaults = (e) => {
            e.preventDefault()
            e.stopPropagation()
        }

        events.forEach(eventName => {
            this.dropArea.addEventListener(eventName, preventDefaults, false)
            document.body.addEventListener(eventName, preventDefaults, false)
        })
    }

    enableHighlightOnDrag() {
        const events = ['dragenter', 'dragover']
        const highlight = (e) => {
            this.dropArea.classList.add('highlight')
            this.dropArea.classList.add('drop-area')
        }

        events.forEach(eventName => {
            this.dropArea.addEventListener(eventName, highlight, false)
        })
    }

    enableDrop(e) {
        const drop = (e) => {
            this.dropArea.classList.remove('drop-area')

            const files = e.dataTransfer.files
            return this.onDropHandler(files)
        }

        this.dropArea.addEventListener('drop', drop, false)
    }
} 