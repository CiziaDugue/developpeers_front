import Vue from 'vue'
import Vuex from 'vuex'

const axios = require('axios');

Vue.use(Vuex)

export default new Vuex.Store({
    state: {

        postsList: [],
        postSingle: [],
        groupsList: []

    },
    mutations: {

        SET_POSTS(state, posts) {

            for (let post of posts) {

                let voteCount = 0;

                for (let i = 0; i < post.votes.length; i++) {

                    if (post.votes[i] === "true") {

                        voteCount = voteCount + 1;
                    } else if (post.votes[i] === "false") {
                        voteCount = voteCount - 1;
                    }
                }
                post.voteCount = voteCount;

                voteCount = 0;

            }

            for (let post of posts) {

                let singlePostPath = "/tous-les-articles/" + post._id;

                post.singlePostPath = singlePostPath;

            }

            state.postsList = posts;

        },
        SET_POST(state, post) {

            let voteCount = 0;

            for (let i = 0; i < post.votes.length; i++) {

                if (post.votes[i] === "true") {

                    voteCount = voteCount + 1;
                } else if (post.votes[i] === "false") {
                    voteCount = voteCount - 1;
                }
            }
            post.voteCount = voteCount;

            state.postSingle = post;

        },
        SET_GROUPS(state, groups) {

            state.groupsList = groups;

        }
    },
    actions: {

        initPostsListAction: function({
            commit
        }) {

            axios.get('http://localhost/projets/developeers/public/api/posts')

                .then(response => {

                    console.log(response.data);

                    let posts = response.data;

                    commit('SET_POSTS', posts);
                })
                .catch(error => {
                    console.log(error)
                });
        },
        initPostSingleAction: function({commit}, payload) {

            axios.get('http://localhost/projets/developeers/public/api/posts/' + payload.postId)

                .then(response => {

                    console.log(response.data);

                    let post = response.data;

                    commit('SET_POST', post);
                })
                .catch(error => {
                    console.log(error)
                });
        },
        initGroupsListAction: function({
            commit
        }) {

            axios.get('http://localhost/projets/developeers/public/api/groups')

                .then(response => {

                    console.log(response.data);

                    let groups = response.data;

                    commit('SET_GROUPS', groups);
                })
                .catch(error => {
                    console.log(error);
                });
        }

    }
})
