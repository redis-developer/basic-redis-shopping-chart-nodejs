<template>
    <v-app>
        <v-container>
            <div class="my-8 d-flex align-center">
                <div class="pa-4 rounded-lg red darken-1">
                    <v-icon color="white" size="45">mdi-cart-plus</v-icon>
                </div>
                <h1 class="ml-6 font-weight-regular">Shopping Cart demo</h1>
            </div>
        </v-container>

        <v-container>
            <v-row>
                <v-col cols="12" sm="7" md="8">
                    <info />
                    <product-list :products="products" />
                </v-col>
                <v-col cols="12" sm="5" md="4" class="d-flex flex-column">
                    <cart />
                    <reset-data-btn class="mt-6" />
                </v-col>
            </v-row>

            <v-footer class="mt-12 pa-0">
                © Copyright 2021 | All Rights Reserved to Redis Labs
            </v-footer>
        </v-container>
    </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Cart from '@/components/Cart';
import ProductList from '@/components/ProductList';
import ResetDataBtn from '@/components/ResetDataBtn.vue';
import Info from '@/components/Info';

export default {
    name: 'App',

    components: {
        ProductList,
        Cart,
        ResetDataBtn,
        Info
    },

    computed: {
        ...mapGetters({
            products: 'products/getProducts'
        })
    },

    async created() {
        await this.fetchProducts();
    },

    methods: {
        ...mapActions({
            fetchProducts: 'products/fetch'
        })
    }
};
</script>
