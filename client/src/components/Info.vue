<template>
    <v-alert
            dense
            color="white"
            class="mb-6 card v-card"
            border="left"
    >
        <v-row
                align="center"
                no-gutters
                @click="alert = !alert"
        >
            <v-col class="grow black--text">
                <h3 class="headline">
                    How it works?
                </h3>
            </v-col>
            <v-col class="shrink">
                <v-btn
                        color="black"
                        outlined
                >
                    {{ alert ? 'Collapse' : 'View more'}}
                </v-btn>
            </v-col>
        </v-row>

        <v-divider v-show="alert"
                   class="my-4 black"
                   style="opacity: 0.22"
        ></v-divider>

        <div v-show="alert">
            <ol class="black--text">
                <li class="font-weight-bold mb-5">How the data is stored:</li>
                <ul class="mb-5">
                    <li>The products data is stored in external json file. After first request this data is saved in a JSON data type in Redis like: <code>JSON.SET product:{productId} . JSON.SET product:{productId} . '{ "id": "productId", "name": "Product Name", "price": "375.00", "stock": 10 }'</code>.</li>
                    <ul class="mb-5">
                        <li>E.g <code>JSON.SET product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 . '{ "id": "e182115a-63d2-42ce-8fe0-5f696ecdfba6", "name": "Brilliant Watch", "price": "250.00", "stock": 2 }'</code></li>
                    </ul>
                    <li>The cart data is stored in a hash like: <code>HSET cart:{cartId} product:{productId} {productQuantity}</code>, where cartId is random generated value and stored in user session.</li>
                    <ul class="mb-5">
                        <li>E.g <code>HSET cart:77f7fc881edc2f558e683a230eac217d product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 1</code></li>
                    </ul>
                </ul>

                <li class="font-weight-bold mb-5">How the data is modified:</li>
                <ul class="mb-5">
                    <li>The product data is modified like <code>JSON.SET product:{productId} . '{ "id": "productId", "name": "Product Name", "price": "375.00", "stock": {newStock} }'</code>.</li>
                    <ul class="mb-5">
                        <li>E.g <code>JSON.SET product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 . '{ "id": "e182115a-63d2-42ce-8fe0-5f696ecdfba6", "name": "Brilliant Watch", "price": "250.00", "stock": 1 }</code></li>
                    </ul>
                    <li>The cart data is modified like <code>HSET cart:{cartId} product:{productId} {newProductQuantity}</code> or <code>HINCRBY cart:{cartId} product:{productId} {incrementBy}</code>.</li>
                    <ul class="mb-5">
                        <li>E.g <code>HSET cart:77f7fc881edc2f558e683a230eac217d product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 2</code></li>
                        <li>E.g <code>HINCRBY cart:77f7fc881edc2f558e683a230eac217d product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 1</code></li>
                        <li>E.g <code>HINCRBY cart:77f7fc881edc2f558e683a230eac217d product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 -1</code></li>
                    </ul>
                    <li>Product can be removed from cart like <code>HDEL cart:{cartId} product:{productId}</code>.</li>
                    <ul class="mb-5">
                        <li>E.g <code>HDEL cart:77f7fc881edc2f558e683a230eac217d product:e182115a-63d2-42ce-8fe0-5f696ecdfba6</code></li>
                    </ul>
                    <li>Cart can be cleared using <code>HGETALL cart:{cartId}</code> and then <code>HDEL cart:{cartId} {productKey}</code> in loop.</li>
                    <ul class="mb-5">
                        <li>E.g <code>HGETALL cart:77f7fc881edc2f558e683a230eac217d</code> => <code>product:e182115a-63d2-42ce-8fe0-5f696ecdfba6</code>, <code>product:f9a6d214-1c38-47ab-a61c-c99a59438b12</code>, <code>product:1f1321bb-0542-45d0-9601-2a3d007d5842</code> => <code>HDEL cart:77f7fc881edc2f558e683a230eac217d product:e182115a-63d2-42ce-8fe0-5f696ecdfba6</code>, <code>HDEL cart:77f7fc881edc2f558e683a230eac217d product:f9a6d214-1c38-47ab-a61c-c99a59438b12</code>, <code>HDEL cart:77f7fc881edc2f558e683a230eac217d product:1f1321bb-0542-45d0-9601-2a3d007d5842</code></li>
                    </ul>
                    <li>All carts can be deleted when reset data is requested like: <code>SCAN {cursor} MATCH cart:*</code> and then <code>DEL cart:{cartId}</code> in loop.</li>
                    <ul class="mb-5">
                        <li>E.g <code>SCAN {cursor} MATCH cart:*</code> => <code>cart:77f7fc881edc2f558e683a230eac217d</code>, <code>cart:217dedc2f558e683a230eac77f7fc881</code>, <code>cart:1ede77f558683a230eac7fc88217dc2f</code> => <code>DEL cart:77f7fc881edc2f558e683a230eac217d</code>, <code>DEL cart:217dedc2f558e683a230eac77f7fc881</code>, <code>DEL cart:1ede77f558683a230eac7fc88217dc2f</code></li>
                    </ul>
                </ul>

                <li class="font-weight-bold mb-5">How the data is accessed:</li>
                <ul class="mb-5">
                    <li>Products: <code>SCAN {cursor} MATCH product:*</code> to get all product keys and then <code>JSON.GET {productKey}</code> in loop.</li>
                    <ul class="mb-5">
                        <li>E.g <code>SCAN {cursor} MATCH product:*</code> => <code>product:e182115a-63d2-42ce-8fe0-5f696ecdfba6</code>, <code>product:f9a6d214-1c38-47ab-a61c-c99a59438b12</code>, <code>product:1f1321bb-0542-45d0-9601-2a3d007d5842</code> => <code>JSON.GET product:e182115a-63d2-42ce-8fe0-5f696ecdfba6</code>, <code>JSON.GET product:f9a6d214-1c38-47ab-a61c-c99a59438b1</code>, <code>JSON.GET product:1f1321bb-0542-45d0-9601-2a3d007d5842</code></li>
                    </ul>
                    <li>Cart: <code>HGETALL cart:{cartId}</code> to get quantity of products and <code>JSON.GET product:{productId}</code> to get products data in loop.</li>
                    <ul class="mb-5">
                        <li>E.g <code>HGETALL cart:77f7fc881edc2f558e683a230eac217d</code>  => <code>product:e182115a-63d2-42ce-8fe0-5f696ecdfba6 (quantity: 1)</code>, <code>product:f9a6d214-1c38-47ab-a61c-c99a59438b12 (quantity: 0)</code>, <code>product:1f1321bb-0542-45d0-9601-2a3d007d5842 (quantity: 2)</code> => <code>JSON.GET product:e182115a-63d2-42ce-8fe0-5f696ecdfba6</code>, <code>JSON.GET product:f9a6d214-1c38-47ab-a61c-c99a59438b12</code>, <code>JSON.GET product:1f1321bb-0542-45d0-9601-2a3d007d5842</code></li>
                    </ul>
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
