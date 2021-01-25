<template>
    <v-container class="pa-3" id="shopping-cart">
        <v-row class="center">
            <h2 class="mb-4">Shopping cart</h2>
        </v-row>
        <v-row>
            <v-col v-if="items.length">
                <h3 class="mb-4">Cart contents</h3>
                <cart-list :items="items" />
                <p class="text-right">
                    Total: <b>${{ total }}</b>
                </p>
            </v-col>
            <v-col v-else class="center">
                <v-icon x-large>mdi-cart</v-icon>
                <p> Cart is Empty. Please add items. </p>
            </v-col>
        </v-row>
        <v-row v-if="items.length" class="mb-1">
            <v-col>
                <v-row>
                    <v-col cols="6">
                        <v-btn style="width: 100%" @click="emptyCart"
                            >Empty cart</v-btn
                        >
                    </v-col>
                    <v-col cols="6">
                        <v-btn style="width: 100%">Checkout</v-btn>
                    </v-col>
                </v-row>
            </v-col>
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
