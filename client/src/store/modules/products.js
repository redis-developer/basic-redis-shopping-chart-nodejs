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
        state.products = products.sort((a, b) => a.name < b.name);
    }
};

const actions = {
    async fetch({ commit }) {
        const { data } = await axios.get('/api/products');

        commit('setProducts', data);

        return data;
    }
};

export default {
    state,
    getters,
    mutations,
    actions,
    namespaced: true
};
