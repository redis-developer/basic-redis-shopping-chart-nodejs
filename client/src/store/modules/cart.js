import axios from '@/plugins/axios';

const initialState = {
    items: []
};

const state = () => initialState;

const getters = {
    getItems: state => state.items
};

const mutations = {
    setItems: (state, items) => {
        state.items = items;
    }
};

const actions = {
    async fetch({ commit }) {
        const { data } = await axios.get('/api/cart');

        commit('setItems', data);

        return data;
    },
    async save({ dispatch }, { id, quantity, incrementBy }) {
        const { data } = await axios.put(`/api/cart/${id}`, {
            quantity,
            incrementBy
        });

        await dispatch('fetch');
        await dispatch('products/fetch', null, { root: true });

        return data;
    },
    async delete({ dispatch }, id) {
        await axios.delete(`/api/cart/${id}`);

        await dispatch('fetch');
        await dispatch('products/fetch', null, { root: true });
    },
    async empty({ dispatch }) {
        await axios.delete('/api/cart');

        await dispatch('fetch');
        await dispatch('products/fetch', null, { root: true });
    }
};

export default {
    state,
    getters,
    mutations,
    actions,
    namespaced: true
};
