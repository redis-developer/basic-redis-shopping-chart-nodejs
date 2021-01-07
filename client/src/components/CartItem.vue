<template>
    <v-container>
        <v-row>
            <v-col class="pa-0" cols="12" sm="4">
                <v-img
                    class=""
                    :src="require(`../assets/products/${item.id}.jpg`)"
                />
            </v-col>
            <v-col class="pa-0 pl-3" cols="12" sm="8">
                <small class="font-weight-bold">{{ item.name }}</small>
                <div class="d-flex">
                    <div class="d-flex">
                        <v-btn
                            class="increment-button"
                            :disabled="itemQuantity === 1"
                            @click="
                                $emit('save', {
                                    id: item.id,
                                    incrementBy: -1
                                })
                            "
                            >-</v-btn
                        >
                        <v-text-field
                            v-model="itemQuantity"
                            class="quantity-input"
                            outlined
                            dense
                            @input="onItemQuantityChange"
                        />
                        <v-btn
                            class="increment-button"
                            :disabled="!item.stock"
                            @click="
                                $emit('save', {
                                    id: item.id,
                                    incrementBy: 1
                                })
                            "
                            >+</v-btn
                        >
                    </div>
                    <v-btn
                        class="increment-button ml-2"
                        color="red lighten-2"
                        @click="$emit('delete', item.id)"
                        ><v-icon>mdi-delete</v-icon></v-btn
                    >
                    <v-spacer />
                    <p class="ml-auto">£{{ item.priceSum }}</p>
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
        item() {
            this.itemQuantity = parseInt(this.item.quantity);
        }
    },

    created() {
        this.itemQuantity = parseInt(this.item.quantity);
    },

    methods: {
        onItemQuantityChange() {
            this.$emit('save', {
                id: this.item.id,
                quantity: this.itemQuantity
            });
        }
    }
};
</script>
