import Vue from 'vue'
import Vuex from 'vuex'

const axios = require('axios');

Vue.use(Vuex)

export default new Vuex.Store({
    state: {

        postsList: [],
        groupsList: []

    },
    mutations: {

        SET_POSTS (state, posts) {

            for (let post of posts) {

                let voteCount = 0;

                for (let vote in post.votes) {

                    if (vote.toLowerCase() == "true") {

                        voteCount++;
                    }
                    else if (vote.toLowerCase() == "false") {
                        voteCount--;
                    }
                }
                post.voteCount = voteCount;

            }

            state.postsList = posts;

        },
        SET_GROUPS (state, groups) {

            state.groupsList = groups;

        }
    },
    actions: {

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
        },
        initGroupsListAction: function({commit}) {

            axios.get('http://localhost/projets/developeers/public/api/groups')

                .then(response => {

                    console.log(response.data)

                    let groups = response.data;

                    commit('SET_GROUPS', groups);
                })
                .catch(error => {
                    console.log(error)
                });
        }

    }
})
