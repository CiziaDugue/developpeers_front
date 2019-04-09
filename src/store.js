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

        SET_POSTS(state, posts) {

            for (let post of posts) {

                voteCounter(post);

            }

            state.postsList = posts;

        },
        SET_POST(state, post) {

            let voteCount = 0;

            voteCounter(post);

            for (let comment of post.active_version.comments) {

                voteCounter(comment);

            }

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
          let headersConfig = {
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijg2NWQ2ODViN2E1OGZkMjI1M2ViYjRkZTgwZmI1NGM2ZDZjMDkxZmFkZDRlNjc5ZGU0YmRjMjA0NzdlZGMzMGZmMWI0OTI2NDJlOTY0Y2Y3In0.eyJhdWQiOiIxIiwianRpIjoiODY1ZDY4NWI3YTU4ZmQyMjUzZWJiNGRlODBmYjU0YzZkNmMwOTFmYWRkNGU2NzlkZTRiZGMyMDQ3N2VkYzMwZmYxYjQ5MjY0MmU5NjRjZjciLCJpYXQiOjE1NTQ3MjgxMzcsIm5iZiI6MTU1NDcyODEzNywiZXhwIjoxNTg2MzUwNTM3LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.I0DZeMFE-vRKu73EUYGRtp9brjj21km_mK1upK_vjeaFUUZ9LQdu8HcT9Vynti_qzV9g5LTUudtkixzLvLBouQANLmqPICaXUbHxz4__PLwC45yBG0IH5898Xbg6CKf9Ng_8iFs2bI0OJ_tUzZqlXWlBsB_TkwvsXZVLyMJW65YhL39TgQNus256O5rvj9vELmJL2hiPUKTALqbryi79iKfMmUDWz6Pu2gn_M-EhpuzizTPpVRqB7gErGGqbD76mg2zw_jB7AAu0SRJlpX1E3Zal_0ZhlyOWZWsz3pffIkwHeps1SbPNwEy2i_zqhGG6BXrBk2w_jXgbESWkEGfemjwUniqWaPCRb1w7Hvf3zqtl2jKATvIW4_YvwdD1--pljGeSgJnT4TGPUbROjsXeJrjCbGjzvgrYOK4JW2tI0a4TOxPrzV2UGbRUFP2XonES6VJ4m3VN1oIYCLlCpZ8cHqZB0hJ_ejg_dKuhG296SgNtMGV7jcV-UlbB9HllS1b1PaL2Ir7yE_xyb8XEmTpG1PPDNDO8hNqm-ZXR0YhpNUYrOrqlzh-oqSMsLnot_8h6eSkmaC-3dn-BDZLMQJelYK9FLTYmIKjsDLPPRv1N1ZvQ-xVjZsh7s_JzyH6hCZlUCHBljkq9X96trfwT2FCMlV_qAfn4ImB41FIfVoW0XP4`,
            'Accept' : 'application/json'
          };
            axios.get('http://localhost/developeers/public/api/posts', {headers: headersConfig})

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

          let headersConfig = {
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijg2NWQ2ODViN2E1OGZkMjI1M2ViYjRkZTgwZmI1NGM2ZDZjMDkxZmFkZDRlNjc5ZGU0YmRjMjA0NzdlZGMzMGZmMWI0OTI2NDJlOTY0Y2Y3In0.eyJhdWQiOiIxIiwianRpIjoiODY1ZDY4NWI3YTU4ZmQyMjUzZWJiNGRlODBmYjU0YzZkNmMwOTFmYWRkNGU2NzlkZTRiZGMyMDQ3N2VkYzMwZmYxYjQ5MjY0MmU5NjRjZjciLCJpYXQiOjE1NTQ3MjgxMzcsIm5iZiI6MTU1NDcyODEzNywiZXhwIjoxNTg2MzUwNTM3LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.I0DZeMFE-vRKu73EUYGRtp9brjj21km_mK1upK_vjeaFUUZ9LQdu8HcT9Vynti_qzV9g5LTUudtkixzLvLBouQANLmqPICaXUbHxz4__PLwC45yBG0IH5898Xbg6CKf9Ng_8iFs2bI0OJ_tUzZqlXWlBsB_TkwvsXZVLyMJW65YhL39TgQNus256O5rvj9vELmJL2hiPUKTALqbryi79iKfMmUDWz6Pu2gn_M-EhpuzizTPpVRqB7gErGGqbD76mg2zw_jB7AAu0SRJlpX1E3Zal_0ZhlyOWZWsz3pffIkwHeps1SbPNwEy2i_zqhGG6BXrBk2w_jXgbESWkEGfemjwUniqWaPCRb1w7Hvf3zqtl2jKATvIW4_YvwdD1--pljGeSgJnT4TGPUbROjsXeJrjCbGjzvgrYOK4JW2tI0a4TOxPrzV2UGbRUFP2XonES6VJ4m3VN1oIYCLlCpZ8cHqZB0hJ_ejg_dKuhG296SgNtMGV7jcV-UlbB9HllS1b1PaL2Ir7yE_xyb8XEmTpG1PPDNDO8hNqm-ZXR0YhpNUYrOrqlzh-oqSMsLnot_8h6eSkmaC-3dn-BDZLMQJelYK9FLTYmIKjsDLPPRv1N1ZvQ-xVjZsh7s_JzyH6hCZlUCHBljkq9X96trfwT2FCMlV_qAfn4ImB41FIfVoW0XP4`,
            'Accept' : 'application/json'
          };

            axios.get('http://localhost/developeers/public/api/posts/' + payload.postId, {headers: headersConfig})

                .then(response => {

                    console.log(response.data);

                    let post = response.data;

                    commit('SET_POST', post);
                })
                .catch(error => {
                    console.log(error)
                });
        },
        initGroupsListAction: function({commit}) {

          let headersConfig = {
            'Authorization': `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijg2NWQ2ODViN2E1OGZkMjI1M2ViYjRkZTgwZmI1NGM2ZDZjMDkxZmFkZDRlNjc5ZGU0YmRjMjA0NzdlZGMzMGZmMWI0OTI2NDJlOTY0Y2Y3In0.eyJhdWQiOiIxIiwianRpIjoiODY1ZDY4NWI3YTU4ZmQyMjUzZWJiNGRlODBmYjU0YzZkNmMwOTFmYWRkNGU2NzlkZTRiZGMyMDQ3N2VkYzMwZmYxYjQ5MjY0MmU5NjRjZjciLCJpYXQiOjE1NTQ3MjgxMzcsIm5iZiI6MTU1NDcyODEzNywiZXhwIjoxNTg2MzUwNTM3LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.I0DZeMFE-vRKu73EUYGRtp9brjj21km_mK1upK_vjeaFUUZ9LQdu8HcT9Vynti_qzV9g5LTUudtkixzLvLBouQANLmqPICaXUbHxz4__PLwC45yBG0IH5898Xbg6CKf9Ng_8iFs2bI0OJ_tUzZqlXWlBsB_TkwvsXZVLyMJW65YhL39TgQNus256O5rvj9vELmJL2hiPUKTALqbryi79iKfMmUDWz6Pu2gn_M-EhpuzizTPpVRqB7gErGGqbD76mg2zw_jB7AAu0SRJlpX1E3Zal_0ZhlyOWZWsz3pffIkwHeps1SbPNwEy2i_zqhGG6BXrBk2w_jXgbESWkEGfemjwUniqWaPCRb1w7Hvf3zqtl2jKATvIW4_YvwdD1--pljGeSgJnT4TGPUbROjsXeJrjCbGjzvgrYOK4JW2tI0a4TOxPrzV2UGbRUFP2XonES6VJ4m3VN1oIYCLlCpZ8cHqZB0hJ_ejg_dKuhG296SgNtMGV7jcV-UlbB9HllS1b1PaL2Ir7yE_xyb8XEmTpG1PPDNDO8hNqm-ZXR0YhpNUYrOrqlzh-oqSMsLnot_8h6eSkmaC-3dn-BDZLMQJelYK9FLTYmIKjsDLPPRv1N1ZvQ-xVjZsh7s_JzyH6hCZlUCHBljkq9X96trfwT2FCMlV_qAfn4ImB41FIfVoW0XP4`,
            'Accept' : 'application/json'
          };

            axios.get('http://localhost/developeers/public/api/groups', {headers: headersConfig})

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
