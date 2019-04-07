import Vue from 'vue'
import Vuex from 'vuex'

const axios = require('axios');

Vue.use(Vuex)

export default new Vuex.Store({
    state: {

        postsList: []

    },
    mutations: {

        // initPostsList: function(state, payload) {
        //
        //     state.postsList = payload;
        //
        // },
        SET_POSTS (state, posts) {

            state.postsList = posts;

        }
    },
    actions: {

        // initPostsListAction: function(context) {
        //
        //     return new Promise((resolve) => {
        //
        //         axios.get('http://localhost/projets/developeers/public/api/posts')
        //
        //             .then((response) => {
        //
        //                 let freshPostsList = [];
        //
        //                 for (let post of response.data) {
        //
        //                     freshPostList.push(post);
        //                 }
        //
        //                 context.dispatch('initPostsList', freshPostsList);
        //
        //                 resolve();
        //             });
        //     });
        //
        // },
        initPostsListAction: function({commit}) {

            axios.get('http://localhost/projets/developeers/public/api/posts')

                .then(response => {

                    console.log(response.data)

                    let posts = response.data;

                    commit('SET_POSTS', posts);
                })
                .catch(error => {
                    console.log(error)
                });
            }


    }
})
