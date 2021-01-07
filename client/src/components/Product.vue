<template>
    <v-col class="text-center" cols="12" sm="6" md="4">
        <v-img :src="require(`../assets/products/${product.id}.jpg`)" />
        <p class="font-weight-bold">{{ product.name }}</p>
        <div v-if="product.stock" class="body-2">
            <p>£{{ product.price }}</p>
            <v-btn class="body-2" @click="$emit('add', product.id)"
                >Add to cart</v-btn
            >
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
