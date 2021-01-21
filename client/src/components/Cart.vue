<template>
    <v-container class="pa-3">
        <v-row id="shopping-cart">
            <v-col v-if="items.length">
                <h3 class="mb-4">Cart contents</h3>
                <cart-list :items="items" />
                <p class="text-right">
                    Total: <b>${{ total }}</b>
                </p>
            </v-col>
            <v-col v-else>
                <p> Cart is empty. Add items to cart </p>
            </v-col>
        </v-row>
        <v-row v-if="items.length" class="mb-1">
            <v-btn color="white lighten-2" @click="emptyCart">Empty cart</v-btn>
            <v-spacer />
            <v-btn>Checkout</v-btn>
        </v-row>
    </v-container>
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
