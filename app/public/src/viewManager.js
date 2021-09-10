export class ViewManager {
    constructor() {
        this.tbody = document.getElementById('tbody')
        this.newFileBtn = document.getElementById('newFileBtn')
        this.fileElement = document.getElementById('fileElem')

        this.formatter = new Intl.DateTimeFormat('pt', {
            locale: 'pt-br',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    configureOnFileChange(fn) {
        this.fileElement.onchange = (e) => fn(e.target.files)
    }

    configureFileBtnClick() {
        this.newFileBtn.onclick = () => this.fileElement.click()
    }

    getIcon(file) {
        return file.match(/\.mp4/i) ? 'movie'
            : file.match(/\.jp|png/i) ? 'image'
            : 'content_copy'    
    }
    
    makeIcon(file) {
        const icon = this.getIcon(file)
        const colors = {
            image: 'yellow600',
            movie: 'red600',
            file: ''
        }

        return `
        <i class="material-icons ${colors[icon]} left">${icon}</i>
        `
    }
    
    updateCurrentFiles(files) {
        const template = (item) => `
        <tr>
            <td>${this.makeIcon(item.file)} ${item.file}</td>
            <td>${item.owner}</td>
            <td>${this.formatter.format(new Date(item.lastModified))}</td>
            <td>${item.size}</td>
        </tr>
        `
        this.tbody.innerHTML = files.map(template).join('')
    }
}