import { AppController } from "./src/appController.js";
import { ConnectionManager } from "./src/connectionManager.js";
import { ViewManager }  from "./src/viewManager.js";
import { DragAndDropManager } from './src/dragAndDropManager.js'

const API_URL = 'https://0.0.0.0:3000'

const appController = new AppController({
    dragAndDropManager: new DragAndDropManager(),
    connectionManager: new ConnectionManager({
        apiUrl: API_URL
    }),
    viewManager: new ViewManager()
})


try {
    await appController.initialize()
} catch (error) {
    console.log('error on initializing', error.message);
}