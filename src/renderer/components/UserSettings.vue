<template>
    <div class="bg-blue flex items-center justify-center h-screen">
        <div class="flex flex-col">
            
            <h1 class="text-white text-sm text-center mb-2">AR Monitor Settings</h1>
            
            <input 
                @keydown="incompleteCredentials = false"
                class="rounded py-3 px-4 mb-2"
                type="text" 
                v-model="credentials.name" placeholder="Sally Johnson" >
            
            <input 
                @keydown="incompleteCredentials = false"
                class="rounded py-3 px-4 mb-2"
                type="text" 
                v-model="credentials.login" placeholder="Login" >
            
            <input 
                @keydown="incompleteCredentials = false"
                class="rounded py-3 px-4 mb-2"
                type="password" 
                v-model="password" placeholder="Password" >
            
            <input
                @keydown="incompleteCredentials = false" 
                class="rounded py-3 px-4 mb-2"
                type="text" 
                v-model="credentials.domain" placeholder="Domain / IP Address" >
            
            <input 
                @keydown="incompleteCredentials = false"
                class="rounded py-3 px-4 mb-2"
                type="text" 
                v-model="credentials.database" placeholder="Database Name" >
            
            <button 
                @click="update" 
                class="bg-blue-lighter mt-2 py-2 rounded hover:bg-blue-light">
                Update
            </button>

            <p class="bg-red-lighter py-2 px-2 mt-2 text-center"
                v-if="incompleteCredentials">
                Please enter all credentials
            </p>

            <p class="bg-red-lighter py-2 px-2 mt-2 text-center"
                v-if="error">
                There was an error connecting
            </p>
        </div>
    </div>
</template>

<script>
import Credentials from '../Credentials.js'

export default {
    props: ['error'],

    mounted() {
        const credentials = new Credentials
        this.loadCredentials(credentials.get())
        credentials.getPassword()
            .then(password => {
                this.password = password
            })
    },

    data () {
        return {
            credentials: {
                name: '',
                login: '',
                database: '',
                domain: '',
                port: 1433,
            },
            password: '',
            incompleteCredentials: false,
        }
    },

    methods: {
        update () {
            if (this.ready) {
                let credentials = new Credentials
                credentials.set(this.credentials)
                credentials.setPassword(this.password)
                this.$emit('connect')
            } else {
                this.incompleteCredentials = true
            }
        },

        loadCredentials(credentials) {
            this.credentials.name     = credentials.name
            this.credentials.login    = credentials.login
            this.credentials.database = credentials.database
            this.credentials.domain   = credentials.domain
            this.credentials.port     = credentials.port
            this.password             = credentials.password
        }
    },

    computed: {
        ready () {
            return this.credentials.name     !== null &&
                   this.credentials.login    !== null &&
                   this.credentials.database !== null &&
                   this.credentials.domain   !== null &&
                   this.credentials.password !== null
        }
    }

}
</script>