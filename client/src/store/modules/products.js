import axios from '@/plugins/axios';

const initialState = {
    products: []
};

const state = () => initialState;

const getters = {
    getProducts: state => state.products
};

const mutations = {
    setProducts: (state, products) => {
        state.products = products;
    }
};

const actions = {
    async fetch({ commit }) {
        const { data } = await axios.get('/api/products');

        const sorted = data.sort((a, b) => {
            if (a.name.localeCompare(b.name) > 0) {
                return 1;
            }

            if (a.name.localeCompare(b.name) < 0) {
                return -1;
            }

            return 0;
        });

        commit('setProducts', sorted);

        return sorted;
    },

    async reset({ dispatch }) {
        await axios.post('/api/products/reset');

        await dispatch('fetch');
        await dispatch('cart/fetch', null, { root: true });
    }
};

export default {
    state,
    getters,
    mutations,
    actions,
    namespaced: true
};
