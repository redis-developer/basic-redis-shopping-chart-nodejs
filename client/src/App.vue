<template>
    <v-app>
        <v-container id="main-container">
            <v-row class="text-center mb-16">
                <v-col class="pa-0" cols="12">
                    <h1 id="title" class="my-10 mx-auto">Shopping cart demo</h1>
                    <v-btn class="mx-auto" @click="resetData">Reset data</v-btn>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pa-0" cols="12" sm="6" md="8">
                    <product-list :products="products" />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                    <h2 class="mb-4">Shopping cart</h2>
                    <cart />
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Cart from '@/components/Cart';
import ProductList from '@/components/ProductList';

export default {
    name: 'App',

    components: {
        ProductList,
        Cart
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
            fetchProducts: 'products/fetch',
            reset: 'products/reset'
        }),

        async resetData() {
            try {
                await this.reset();
            } catch (error) {
                console.error(error);
            }
        }
    }
};
</script>
