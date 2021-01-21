<template>
    <v-btn v-if="cartItems.length" class="mx-auto" @click="resetData">
        Reset data
    </v-btn>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({ cartItems: 'cart/getItems' })
    },

    methods: {
        ...mapActions({
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
