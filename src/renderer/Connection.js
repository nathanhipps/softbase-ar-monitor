import Sequelize from 'sequelize'

class Connection {
    constructor(credentials) {
        this.sequelize = new Sequelize(credentials.database, credentials.login, credentials.password, {
            host: credentials.domain,
            dialect: 'mssql',
            operatorsAliases: false,
            dialectOptions: {
                encrypt: true
            }
        })  
    }
}

export default Connection
