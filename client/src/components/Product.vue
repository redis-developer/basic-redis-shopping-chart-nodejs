<template>
    <v-col class="product text-center" cols="12" sm="6" md="4">
        <div class="product-content">
            <div class="product-img">
                <v-badge
                    :content="product.stock ? product.stock : '0'"
                    :color="product.stock ? 'green' : 'red'"
                >
                    <v-img
                        class="img mw75"
                        :src="require(`@/assets/products/${product.id}.jpg`)"
                    />
                </v-badge>
            </div>

            <p class="font-weight-bold">{{ product.name }}</p>
            <div v-if="product.stock" class="body-2">
                <p>${{ product.price }}</p>
                <v-btn
                    class="body-2"
                    style="width: 100%"
                    @click="$emit('add', product.id)"
                    >Add to cart</v-btn
                >
            </div>
        </div>
    </v-col>
</template>

<script>
export default {
    name: 'Product',

    props: {
        product: {
            type: Object,
            required: true
        }
    }
};
</script>

<style lang="sass" scoped>
@import '@/styles/images.scss'
</style>
