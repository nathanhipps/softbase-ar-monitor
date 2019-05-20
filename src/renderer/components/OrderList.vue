<template>
    <table class="w-full">
        <tbody>
            <tr class="bg-grey-light"
            :class="order.notified === true ? 'bg-red-lighter' : ''"
            v-for="order in orders" 
            :key="order.WONo">
                <td class="py-2 pl-6 border-b-2 border-grey">
                    {{ order.WONo }}
                </td>
                <td class="py-4 px-2 border-b-2 border-grey">
                    <span class="font-bold">{{ order.ShipName }}</span> <br>
                    <span class="text-sm">{{ order.ShipAddress}}</span><br>
                    <span class="text-sm">
                        {{ order.ShipCity }}, {{ order.ShipState }} {{ order.ShipZipCode}}
                    </span>
                </td>
                <td class="py-2 px-2 border-b-2 border-grey text-center">
                    {{ moment(Date.parse(order.OpenDate)).format('L') }} <br>
                    <span class="text-sm">{{ moment(Date.parse(order.OpenDate)).add(4, 'hours').fromNow() }}</span>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import moment from 'moment'

export default {
    props: ['orders'],

    methods: {
        moment
    }
}
</script>
