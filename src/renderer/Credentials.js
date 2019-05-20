import electron from 'electron'
import keytar from 'keytar'
import path from 'path'
import fs from 'fs'

class Credentials {
    constructor () {
        let userDataPath = (electron.app || electron.remote.app).getPath('userData')
        this.path = path.join(userDataPath, 'ar_monitor_settings.json')
        if (! fs.existsSync(this.path)) {
            fs.writeFileSync(this.path, JSON.stringify({}));
        }
        this.credentials = JSON.parse(fs.readFileSync(this.path))
    }

    get () {
        return this.credentials
    }

    set (credentials) {
        fs.writeFileSync(this.path, JSON.stringify(credentials))
    }

    async getPassword() {
        return await keytar.getPassword('ar_monitor', 'ar_monitor')
    }

    async setPassword(password) {
        await keytar.setPassword('ar_monitor', 'ar_monitor', password)
    }
}

export default Credentials
