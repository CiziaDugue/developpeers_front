import Vue from 'vue'
import Vuex from 'vuex'

const axios = require('axios');

Vue.use(Vuex)

let voteCounter = function(object) {
    let votePros = 0;
    let voteCons = 0;
    for (let i = 0; i < object.votes.length; i++) {

        if (object.votes[i] === "true") {
            votePros = votePros + 1;
        }
        else if (object.votes[i] === "false") {
            voteCons = voteCons + 1;
        }
    }
    object.votePros = votePros;
    object.voteCons = voteCons;
    return object;
}

export default new Vuex.Store({
    state: {

        postsList: [],
        postSingle: [],
        groupsList: []

    },
    mutations: {

        GET_POSTS(state, posts) {

            for (let post of posts) {

                voteCounter(post);

            }

            state.postsList = posts;

        },
        GET_POST(state, post) {

            let voteCount = 0;

            voteCounter(post);

            voteCounter(post.active_version);

            for (let comment of post.active_version.comments) {

                voteCounter(comment);

            }

            state.postSingle = post;

        },
        ADD_COMMENT(state, payload) {

            state.postSingle.active_version.comments.push(payload.comment);

        },
        GET_GROUPS(state, groups) {

            state.groupsList = groups;

        }
    },
    actions: {

        initPostsListAction: function({commit}, listType) {

            console.log(listType.type);

            let req = '';

            if (listType.type == 'tous-les-articles') {

                req = 'http://localhost/projets/developeers/public/api/posts';

            }
            else if (listType.type == 'mes-articles') {

                req = 'http://localhost/projets/developeers/public/api/posts/author/' + '1';

            }

            axios.get(req)

                .then(response => {

                    console.log(response.data);

                    let posts = response.data;

                    commit('GET_POSTS', posts);
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

                    commit('GET_POST', post);
                })
                .catch(error => {
                    console.log(error)
                });
        },

        changePostVersionAction: function({commit}, payload) {

            axios.get('http://localhost/projets/developeers/public/api/posts/' + payload.post_id + '/' + payload.version_id)

                .then(response => {

                    console.log(response.data);

                    let post = response.data;

                    commit('GET_POST', post);
                })
                .catch(error => {
                    console.log(error)
                });
        },

        addCommentAction: function({commit}, payload) {

            let headerConfig = {'Content-Type': 'application/json'}

            axios.post('http://localhost/projets/developeers/public/api/comments/' + payload.version_id, payload.comment, { headers: headerConfig })

                .then(response => {

                    commit('ADD_COMMENT', payload);
                    // commit('GET_POST', payload.post_id);
                })
                .catch(error => {
                    console.log(error)
                });
        },

        initGroupsListAction: function({commit}) {

            axios.get('http://localhost/projets/developeers/public/api/groups')

                .then(response => {

                    console.log(response.data);

                    let groups = response.data;

                    commit('GET_GROUPS', groups);
                })
                .catch(error => {
                    console.log(error);
                });
        }

    }
})
