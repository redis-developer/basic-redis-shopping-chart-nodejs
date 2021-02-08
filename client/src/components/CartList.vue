<template>
    <v-row>
        <v-col v-for="item in items" :key="item.id" cols="12">
            <cart-item :item="item" @save="save" @delete="remove" />
        </v-col>
    </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CartItem from '@/components/CartItem';

export default {
    name: 'CartList',

    components: {
        CartItem
    },

    props: {
        items: {
            type: Array,
            required: false,
            defaultValue: () => []
        }
    },

    computed: {
        ...mapGetters({ products: 'products/getProducts' })
    },

    methods: {
        ...mapActions({
            saveItems: 'cart/save',
            deleteItem: 'cart/delete'
        }),

        async save(data) {
            try {
                if (data.quantity === '') {
                    return;
                }

                if (data.quantity) {
                    data.quantity = parseInt(data.quantity);

                    if (data.quantity === 0) {
                        await this.remove(data.id);

                        return;
                    }

                    const itemInCart = this.items.find(
                        item => item.id === data.id
                    );

                    const item = this.products.find(
                        item => item.id === data.id
                    );

                    const inCartQuantity = parseInt(itemInCart.quantity);

                    if (
                        data.quantity > inCartQuantity &&
                        data.quantity > inCartQuantity + item.stock
                    ) {
                        return;
                    }
                }

                await this.saveItems(data);
            } catch (error) {
                console.error(error);
            }
        },

        async remove(id) {
            try {
                await this.deleteItem(id);
            } catch (error) {
                console.error(error);
            }
        }
    }
};
</script>
