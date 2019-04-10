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
        groupsList: [],
        userLogged: false,
        authUserData: {},
        headerObject:{}
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

            voteCounter(post.active_version);

            for (let comment of post.active_version.comments) {

                voteCounter(comment);

            }

            state.postSingle = post;

        },
        ADD_COMMENT(state, payload) {

            state.postSingle.active_version.comments.push(payload.comment);

        },
        SET_GROUPS(state, groups) {

            state.groupsList = groups;

        },
        // SET_FOLLOW_GROUP(state, group) {
        //
        //     //plutot reexecuter requete get groups
        //     let id = state.authUserData._id;
        //     let name = state.authUserData.name;
        //
        //     for (let item of state.groupsList){
        //
        //         if (item._id === group._id){
        //
        //             item.users_id.push(id);
        //             item.users.push({[id]: name});
        //         }
        //     }
        // },
        SET_AUTH_USER_DATA_IN(state, userData) {

          state.authUserData = userData;
          state.userLogged = true;
          //console.log(this.state);
        },
        SET_AUTH_USER_DATA_OUT(state, headerObject) {

          state.authUserData = {};
          state.headerObject = headerObject;
          state.userLogged = false;
          //console.log(this.state);
          console.log(state.headerObject);
        },
        SET_HEADER_OBJECT(state, headerObject) {

          state.headerObject = headerObject;
          //console.log(headerObject);
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

                req = 'http://localhost/projets/developeers/public/api/posts/author';

            }
            else if (listType.type == 'articles-suivis') {

                req = 'http://localhost/projets/developeers/public/api/posts/user';

            }

            axios.get(req, {headers: this.state.headerObject})

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

            axios.get('http://localhost/projets/developeers/public/api/posts/' + payload.postId, {headers: this.state.headerObject})

                .then(response => {

                    console.log(response.data);

                    let post = response.data;

                    commit('SET_POST', post);
                })
                .catch(error => {
                    console.log(error)
                });
        },

        changePostVersionAction: function({commit}, payload) {

            axios.get('http://localhost/projets/developeers/public/api/posts/' + payload.post_id + '/' + payload.version_id, {headers: this.state.headerObject})

                .then(response => {

                    console.log(response.data);

                    let post = response.data;

                    commit('SET_POST', post);
                })
                .catch(error => {
                    console.log(error)
                });
        },

        addCommentAction: function({commit}, payload) {

            axios.post('http://localhost/projets/developeers/public/api/comments/' + payload.version_id, payload.comment, { headers: this.state.headerObject})

                .then(response => {

                    commit('ADD_COMMENT', payload);
                    // commit('GET_POST', payload.post_id);
                })
                .catch(error => {          console.log(this.state);
                    console.log(error)
                });
        },

        initGroupsListAction: function({commit}, listType) {

            console.log(listType.type);

            let req = '';

            if (listType.type == 'tous-les-groupes') {

                req = 'http://localhost/projets/developeers/public/api/groups';

            }
            else if (listType.type == 'mes-groupes') {

                req = 'http://localhost/projets/developeers/public/api/groups/user';

            }

            axios.get(req, {headers: this.state.headerObject})

                .then(response => {

                    console.log(response.data);

                    let groups = response.data;

                    commit('SET_GROUPS', groups);
                })
                .catch(error => {
                    console.log(error);
                });
        },

        leaveOrJoinGroupAction: function({commit, dispatch}, payload) {

            let req = 'http://localhost/projets/developeers/public/api/groups/' + payload.action + '/' + payload.group._id;

            axios.put(req, {}, { headers: this.state.headerObject } )

                .then((response) => {

                    console.log(response.data);

                    let listType = {
                        type: payload.param
                    }

                    dispatch('initGroupsListAction', listType);
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        logUser: function({commit, dispatch}, logData) {

          axios.post('http://localhost/projets/developeers/public/api/login', logData)
            .then( (response1) => {

              axios.get('http://localhost/projets/developeers/public/api/user',
              {
                headers :
                {
                  'Authorization': 'Bearer '+ response1.data.token,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              })
                  .then( (response2) => {

                      let userData = {
                        "token": "Bearer "+response1.data.token,
                        "id": response2.data.user.id,
                        "email": response2.data.user.email,
                        "name": response2.data.user.name
                      };

                      commit('SET_AUTH_USER_DATA_IN', userData);
                      dispatch('setHeaderObject', userData);

                  })
                  .catch( (error) => {
                      console.log(error);
                  });
            })
            .catch(function (error) {
              console.log(error);
            });
        },

        registerUser: function({commit, dispatch}, registerData) {

          axios.post('http://localhost/projets/developeers/public/api/register', registerData)
                .then( (response1) => {

                  console.log(response1);

                    axios.get('http://localhost/projets/developeers/public/api/user',
                    {
                      headers :
                      {
                        'Authorization': 'Bearer '+ response1.data.token,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                      }
                    })
                        .then( (response2) => {

                            let userData = {
                              "token": "bearer "+response1.data.token,
                              "id": response2.data.user.id,
                              "email": response2.data.user.email,
                              "name": response2.data.user.name
                            };

                            commit('SET_AUTH_USER_DATA_IN', userData);
                            dispatch('setHeaderObject', userData);

                        })
                        .catch( (error) => {
                            console.log(error);
                        });
                })
                .catch(function (error) {
                  console.log(error);
                });

          console.log(registerData);
        },

        disconnectUser: function({commit}) {
          console.log("store.disconnect");
          let headerObject = {
            'Content-Type': 'application/json'
          };
          commit('SET_AUTH_USER_DATA_OUT', headerObject);
        },

        setHeaderObject: function({commit}, userData) {
          let headerObject = {
            'Authorization': userData.token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          };
          commit('SET_HEADER_OBJECT', headerObject);
          console.log('setting header object');
        }
    }
})
