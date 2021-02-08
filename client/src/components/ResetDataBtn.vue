<template>
    <v-btn class="mx-auto error" @click="resetData">
        Reset data
        <v-icon right dark>mdi-restore</v-icon>
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
