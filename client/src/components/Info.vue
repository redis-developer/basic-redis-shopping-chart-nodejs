<template>
    <v-alert
            text
            dense
            color="info"
            class="mb-6"
            border="left"

    >
        <v-row
                align="center"
                no-gutters
                @click="alert = !alert"
        >
            <v-col class="grow">
                <h3 class="headline">
                    How it works?
                </h3>
            </v-col>
            <v-col class="shrink">
                <v-btn
                        color="info"
                        outlined
                >
                    {{ alert ? 'Collapse' : 'View more'}}
                </v-btn>
            </v-col>
        </v-row>

        <v-divider v-show="alert"
                   class="my-4 info"
                   style="opacity: 0.22"
        ></v-divider>

        <div v-show="alert">
            <ol>
                <li>How the data is stored:</li>
                <ul class="mb-5">
                    <li>The products data is stored in external json file. After first request this data is saved in a JSON data type in Redis like: <code>JSON.SET product:{productId} . {product data in json format}</code>.</li>
                    <li>The cart data is stored in a hash like: <code>HSET cart:{cartId} product:{productId} {productQuantity}</code>, where cartId is random generated value and stored in user session.</li>
                </ul>

                <li>How the data is modified:</li>
                <ul class="mb-5">
                    <li>The product data is modified like <code>JSON.SET product:{productId} . {new product data in json format}</code>.</li>
                    <li>The cart data is modified like <code>HSET cart:{cartId} product:{productId} {newProductQuantity}</code> or <code>HINCRBY cart:{cartId} product:{productId} {incrementBy}</code>.</li>
                    <li>Product can be removed from cart like <code>HDEL cart:{cartId} product:{productId}</code>.</li>
                    <li>Cart can be cleared using <code>HGETALL cart:{cartId}</code> and then <code>HDEL cart:{cartId} {productKey}</code>.</li>
                    <li>All carts can be deleted when reset data is requested like: <code>DEL cart:{cartId}</code></li>
                </ul>

                <li>How the data is accessed:</li>
                <ul class="mb-5">
                    <li>Products: <code>SCAN {cursor} MATCH product:*</code> to get all product keys and then <code>JSON.GET {productKey}</code></li>
                    <li>Cart: <code>HGETALL cart:{cartId}</code> to get quantity of products and <code>JSON.GET product:{productId}</code> to get products data.</li>
                </ul>
            </ol>
        </div>
    </v-alert>
</template>

<script>
    export default {
        data() {
            return {
                alert: false,
            };
        }
    }
</script>
