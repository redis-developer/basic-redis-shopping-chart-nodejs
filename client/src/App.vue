<template>
    <v-app>
        <v-container id="main-container">
            <v-row class="text-center mb-16">
                <v-col class="pa-0" cols="12">
                    <h1 id="title" class="my-10 mx-auto">Shopping cart demo</h1>
                </v-col>
            </v-row>
            <v-row>
                <v-col class="pa-0" cols="12" sm="6" md="8" xl="8">
                    <product-list :products="products" />
                </v-col>
                <v-col cols="12" sm="6" md="4" xl="4">
                    <cart />
                </v-col>
            </v-row>
            <v-row class="mb-12">
                <v-col class="pa-0" cols="12" sm="6" md="8" xl="9">
                    <v-spacer />
                </v-col>
                <v-col cols="12" sm="6" md="4" xl="3">
                    <reset-data-btn />
                </v-col>
            </v-row>

            <v-footer id="footer" class="mt-12 pa-0">
                {{ new Date().getFullYear() }} ⓒ
            </v-footer>
        </v-container>
    </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Cart from '@/components/Cart';
import ProductList from '@/components/ProductList';
import ResetDataBtn from '@/components/ResetDataBtn.vue';

export default {
    name: 'App',

    components: {
        ProductList,
        Cart,
        ResetDataBtn
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
