import Vue from 'vue';
import Vuex from 'vuex';
import searchParam from './store/searchParam'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        searchParam,
    }
});
