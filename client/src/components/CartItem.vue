<template>
    <v-container>
        <v-row>
            <v-col class="pa-0" cols="12" sm="4">
                <v-img
                    class="img mw50"
                    :src="require(`@/assets/products/${item.id}.jpg`)"
                />
            </v-col>
            <v-col class="pa-0 pl-3" cols="12" sm="8">
                <small class="font-weight-bold">{{ item.name }}</small>
                <div class="d-flex flex-wrap">
                    <v-btn-toggle rounded>
                        <v-btn
                            :disabled="itemQuantity === 1"
                            small
                            @click="incrementItem(-1)"
                            >-</v-btn
                        >
                        <v-text-field
                            v-model="itemQuantity"
                            class="quantity-input v-btn v-btn--disabled v-size--small"
                            style="overflow: hidden"
                            outlined
                            dense
                            @input="onItemQuantityChange"
                        />
                        <v-btn
                            :disabled="!item.stock"
                            small
                            @click="incrementItem(1)"
                            >+</v-btn
                        >
                    </v-btn-toggle>
                    <v-btn
                        class="increment-button ml-2"
                        color="white lighten-2"
                        @click="deleteItem(item.id)"
                        ><v-icon>mdi-delete</v-icon></v-btn
                    >
                    <v-spacer />
                    <p class="ml-auto">${{ item.priceSum }}</p>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'CartItem',

    props: {
        item: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            itemQuantity: 0
        };
    },

    watch: {
        item: {
            immediate: true,
            handler(value) {
                this.itemQuantity = parseInt(value.quantity);
            }
        }
    },

    methods: {
        onItemQuantityChange() {
            this.$emit('save', {
                id: this.item.id,
                quantity: this.itemQuantity
            });
        },

        deleteItem(id) {
            this.$emit('delete', id);
        },

        incrementItem(value) {
            this.$emit('save', {
                id: this.item.id,
                incrementBy: value
            });
        }
    }
};
</script>

<style lang="sass" scoped>
@import '@/styles/images.scss'
</style>
