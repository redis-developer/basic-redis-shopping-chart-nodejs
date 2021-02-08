<template>
        <v-row v-if="products.length" align="stretch">
            <product
                v-for="product in products"
                :key="product.id"
                :product="product"
                @add="addToCart"
            />
        </v-row>
        <v-row v-else>
            <p> No products in store </p>
        </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import Product from '@/components/Product';

export default {
    name: 'ProductList',

    props: {
        products: {
            type: Array,
            required: false,
            defaultValue: () => []
        }
    },

    components: {
        Product
    },

    methods: {
        ...mapActions({
            saveItem: 'cart/save'
        }),

        async addToCart(id) {
            try {
                await this.saveItem({ id, incrementBy: 1 });
            } catch (error) {
                console.error(error);
            }
        }
    }
};
</script>
