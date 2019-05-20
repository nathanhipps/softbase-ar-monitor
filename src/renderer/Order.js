import Sequelize from 'sequelize'

class Order {
    constructor(connection) {
        this.connection = connection
        this.model = this.connection.sequelize.define('WO', 
        {
            WONo: {
            type: Sequelize.INTEGER,
            primaryKey: true
            },
            ShipName: {
            type: Sequelize.STRING
            },
            ShipAddress: {
            type: Sequelize.STRING
            },
            ShipCity: {
            type: Sequelize.STRING
            },
            ShipState: {
            type: Sequelize.STRING
            },
            ShipZipCode: {
            type: Sequelize.STRING
            },
            OpenBy: {
            type: Sequelize.STRING
            },
            CustomerSale: {
            type: Sequelize.INTEGER
            },
            OpenDate: {
            type: Sequelize.DATE
            },
            ClosedDate: {
            type: Sequelize.DATE
            },
            CreditFlag: {
            type: Sequelize.INTEGER
            }
        }, 
        {
            freezeTableName: true,
            timestamps: false
        })
    }

    get () {
        return this.model.findAll({
            where: {
                ClosedDate: null,
                CustomerSale: -1,
                CreditFlag: 2
            },
            order: [['OpenDate', 'desc']],
            limit: 100
        }).then (data => {
            return data
        }).catch (error => {
            return false
        })
    }
}

export default Order