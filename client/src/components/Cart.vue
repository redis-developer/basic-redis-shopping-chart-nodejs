<template>
    <v-card elevation="5" class="mr-md-4" dark>
        <v-card-title class="pa-3">
            <v-icon class="mr-2">mdi-cart</v-icon>
            Shopping cart
        </v-card-title>

        <v-card-text v-if="items.length" class="pa-3">
            <cart-list :items="items" />

            <v-divider class="mt-6 mb-2" />

            <div class="text-right text title">
                Total: <span class="font-weight-black">${{ total }}</span>
            </div>
        </v-card-text>

        <v-card-text v-else class="pa-3 text-center">
            <v-icon x-large>mdi-cart</v-icon>
            <p> Cart is Empty. Please add items. </p>
        </v-card-text>

        <v-card-actions class="pa-3 justify-space-between">
            <v-btn
                outlined
                color="orange"
                @click="emptyCart"
            >
                <span class="d-xs-flex d-none d-xl-flex">Clear cart</span>
                <v-icon right dark > mdi-close-circle-outline </v-icon>
            </v-btn>
            <v-btn class="primary">
                Checkout
                <v-icon right dark > mdi-check </v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CartList from '@/components/CartList';

export default {
    name: 'Cart',

    components: {
        CartList
    },

    computed: {
        ...mapGetters({ cartItems: 'cart/getItems' }),

        items() {
            return this.cartItems
                ? this.cartItems.map(({ quantity, product }) => ({
                      ...product,
                      quantity,
                      priceSum: quantity * product.price
                  }))
                : [];
        },

        total() {
            return this.cartItems
                ? this.cartItems.reduce(
                      (prev, { quantity, product: { price } }) =>
                          prev + quantity * price,
                      0
                  )
                : 0;
        }
    },

    async created() {
        await this.fetchCart();
    },

    methods: {
        ...mapActions({
            fetchCart: 'cart/fetch',
            emptyCart: 'cart/empty'
        })
    }
};
</script>
