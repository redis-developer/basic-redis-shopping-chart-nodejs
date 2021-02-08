<template>
        <v-card class="secondary rounded-lg px-2 pr-lg-2 pl-lg-0 mb-2" >
            <v-row>
                <v-col cols="4" lg="3" md="0" class="py-0 d-lg-flex d-sm-none d-md-none pl-0 pl-sm-3 pl-md-3 pl-lg-3">
                    <v-img
                        class="rounded-lg d-lg-flex d-md-none"
                        min-height="100%"
                        :src="require(`@/assets/products/${item.id}.jpg`)"
                    />
                </v-col>

                <v-col cols="8" lg="9" md="12" sm="12">
                        <v-card-title class="text-subtitle-1 text-xl-h6 pa-0">
                            {{ item.name }}
                        </v-card-title>

                        <v-card-actions class="justify-space-between text-xl-h6 px-0">
                            ${{ item.priceSum }}

                            <v-btn-toggle
                                multiple
                                rounded
                                class="secondary"
                            >
                                <v-btn small @click="incrementItem(-1)">
                                    -
                                </v-btn>

                                <v-btn small>
                                    <v-text-field
                                        style="max-width:10px;"
                                        v-model="itemQuantity"
                                        @input="onItemQuantityChange"
                                    />
                                </v-btn>

                                <v-btn
                                    :disabled="!item.stock"
                                    small
                                    @click="incrementItem(1)"
                                >
                                    +
                                </v-btn>
                            </v-btn-toggle>
                        </v-card-actions>
                </v-col>
        </v-row>
        </v-card>
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
            if (this.itemQuantity + value === 0) {
                this.deleteItem(this.item.id);

                return;
            }

            this.$emit('save', {
                id: this.item.id,
                incrementBy: value
            });
        }
    }
};
</script>
