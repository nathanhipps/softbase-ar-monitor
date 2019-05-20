<template>
    <div id="app" class="bg-grey-light h-screen">
        <nav class="fixed pin-t w-full">
            <div class="flex">
                <div @click="select = 'all'" 
                     class="flex-1 bg-grey-dark text-grey-lightest text-center py-2 hover:bg-grey-darker">
                    All
                </div>
                <div @click="select = 'gp'" 
                     class="flex-1 bg-grey-dark text-grey-lightest text-center py-2 hover:bg-grey-darker">
                    GP
                </div>
                <div @click="select = 'mp'" 
                     class="flex-1 bg-grey-dark text-grey-lightest text-center py-2 hover:bg-grey-darker">
                    MP
                </div>
                <div @click="select = 'ss'"  
                     class="flex-1 bg-grey-dark text-grey-lightest text-center py-2 hover:bg-grey-darker">
                    SS
                </div>
                <div @click="select = 'approved'" 
                     class="flex-1 bg-grey-dark text-grey-lightest text-center py-2 hover:bg-grey-darker">
                    Released
                </div>
                <div @click="showSettings" 
                     class="bg-grey-dark text-grey-lightest text-center py-2 px-4 hover:bg-grey-darker">
                    ⚙️
                </div>
            </div>
        </nav>
        <div class="mt-8">
            <order-list v-if="! errorConnecting && ! settings" :orders="selected" />
            <user-Settings
                :error="errorConnecting"
                @connect="connect"
                v-show="errorConnecting || settings" />
        </div>
    </div>
</template>

<script>
    import OrderList from '@/components/OrderList'
    import Connection from './Connection.js'
    import Credentials from './Credentials.js'
    import UserSettings from '@/components/UserSettings'
    import Order from './Order.js'

    export default {

        mounted () {
            this.connect()

            let timerId = setInterval(() => {
                this.get()
            }, 60000);
        },

        data () {
            return {
            credentials: {},
            orders: [],
            previous: [],
            released: [],
            connection: {},
            errorConnecting: false,
            settings: false,
            select: 'all'
            }
        },

        computed: {
            selected () {
                return this[this.select](this.orders)
            }
        },

        methods: {
            async get () {
                const orders = new Order(this.connection)
                orders.get().then(orders => {
                    this.previous = this.orders
                    this.orders = orders
                    this.compare()
                })
            },

            all () {
                return this.orders
            },

            gp () {
                return this.orders.filter(order => {
                    return order.WONo.toString().startsWith('9')
                })
            },

            mp () {
                return this.orders.filter(order => {
                    return order.WONo.toString().startsWith('8')
                })
            },

            ss () {
                return this.orders.filter(order => {
                    return order.WONo.toString().startsWith('7')
                })
            },

            approved () {
                this.settings = false
                return this.released
            },

            showSettings () {
                this.settings = ! this.settings

            },

            compare() {
                let woNumbers = this.orders.map((order) => {
                    return order.WONo
                })

                let justReleased = this.previous.filter(order => {
                    return ! woNumbers.includes(order.WONo)
                })
                
                this.released = this.released.concat(justReleased)

                this.released.forEach(order => {
                    if (order.OpenBy === this.credentials.name && order.notified === undefined) {
                        new Notification('Order Released', {
                            body: `Order: ${order.WONo} for ${order.ShipName} has been released`,
                            requireInteraction: true,
                            sticky: true
                        })
                        order.notified = true
                    }
                })
            },

            connect() {
                let creds = new Credentials
                this.credentials = creds.get()
                this.settings = false
                creds.getPassword()
                    .then(password => {
                        this.credentials.password = password
                        this.connection = new Connection(this.credentials)
                        this.connection.sequelize.authenticate()
                            .then(() => {
                                this.errorConnecting = false
                                this.get()
                            })
                            .catch(err => {
                                this.errorConnecting = true
                                console.log('Could not connect')
                    });
                })
            }
        },

        name: 'ar_monitor',
        
        components: {
            OrderList, UserSettings
        }
    }
</script>

<style>
  @import "~@/assets/tailwind.css";
</style>
