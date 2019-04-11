import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

const axios = require('axios');

Vue.use(Vuex)

let voteCounter = function(object) {
    let votePros = 0;
    let voteCons = 0;
    for (let i = 0; i < object.votes.length; i++) {

        if (object.votes[i].vote == true) {
            votePros = votePros + 1;
        }
        else if (object.votes[i].vote == false) {
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
        postSingle: {},
        groupsList: [],
        groupSingle: {},
        postsFeed: [],
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
        // ADD_COMMENT(state, payload) {
        //
        //     state.postSingle.active_version.comments.push(payload.comment);
        //
        // },
        SET_GROUPS(state, groups) {

            state.groupsList = groups;

        },

        SET_GROUP(state, group) {

        },

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
        },
        SET_POSTS_FEED(state, posts) {

          for (let post of posts) {

              voteCounter(post);

          }

          state.postsFeed = posts;
        }
    },
    actions: {

        initPostsListAction: function({commit}, data) {

            let listType = data.listType;
            let groupId = data.groupId;

            let req = '';

            if (listType == 'tous-les-articles') {

                req = 'http://localhost/developeers/public/api/posts';

            }
            else if (listType == 'mes-articles') {

                req = 'http://localhost/developeers/public/api/authorposts';

            }
            else if (listType == 'articles-suivis') {

                req = 'http://localhost/developeers/public/api/userposts';

            }
            else if (listType == 'group-posts') {
              req = 'http://localhost/developeers/public/api/posts/group/'+ groupId;
            }

            axios.get(req, {headers: this.state.headerObject})

                .then( (response) => {
                    let posts = response.data;
                    commit('SET_POSTS', posts);
                })
                .catch(error => {
                    console.log(error)
                });

        },

        initPostSingleAction: function({commit}, payload) {

            axios.get('http://localhost/developeers/public/api/posts/' + payload.postId, {headers: this.state.headerObject})

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

            axios.get('http://localhost/developeers/public/api/posts/' + payload.post_id + '/' + payload.version_id, {headers: this.state.headerObject})

                .then(response => {

                    console.log(response.data);

                    let post = response.data;

                    commit('SET_POST', post);
                })
                .catch(error => {
                    console.log(error)
                });
        },

        addCommentAction: function({dispatch}, payload) {

            axios.post('http://localhost/developeers/public/api/comments/' + payload.version_id, payload.comment, { headers: this.state.headerObject})

                .then(response => {

                    dispatch('changePostVersionAction', payload);
                })
                .catch(error => {          console.log(this.state);
                    console.log(error)
                });
        },

        voteAction: function({dispatch}, payload) {

            let req = 'http://localhost/developeers/public/api/vote' + payload.type + '/' + payload.target._id;

            let voteType = {
                vote: payload.vote
            };

            axios.put(req, voteType, { headers: this.state.headerObject })

                .then((response) => {

                    console.log(response.data);

                    if (payload.urlParam == 'tous-les-articles' || payload.urlParam == 'mes-articles' || payload.urlParam == 'articles-suivis') {
                        let listType = {
                            type: payload.urlParam
                        };
                        dispatch('initPostsListAction', listType);
                    }
                    else {
                        let postId = {
                            postId: payload.urlParam
                        };
                        dispatch('initPostSingleAction', postId);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        initGroupsListAction: function({commit}, listType) {

            console.log(listType.type);

            let req = '';

            if (listType.type == 'tous-les-groupes') {

                req = 'http://localhost/developeers/public/api/groups';

            }
            else if (listType.type == 'mes-groupes') {

                req = 'http://localhost/developeers/public/api/groups/user';

            }

            axios.get(req, {headers: this.state.headerObject})

                .then( (response) => {

                    console.log(response.data);

                    let groups = response.data;

                    commit('SET_GROUPS', groups);
                })
                .catch(error => {
                    console.log(error);
                });
        },

        initGroupSingleAction: function({commit}, groupId) {
          //axios.get('http://localhost/developeers/public/api/groups/'+)
          commit('SET_GROUP', group);
        },

        leaveOrJoinGroupAction: function({commit, dispatch}, payload) {

            let req = 'http://localhost/developeers/public/api/groups/' + payload.action + '/' + payload.group._id;

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

        getPostsFeed: function({commit}) {

          axios.get('http://localhost/developeers/public/api/postsfeed', {headers: this.state.headerObject})

              .then( (response) => {
                  let posts = response.data;
                  commit('SET_POSTS_FEED', posts);
              })
              .catch( (error) => {
                  console.error(error);
              });
        },

        getSearchResult: function({commit, dispatch}, words) {
          if (words != "") {
            let req = 'http://localhost/developeers/public/api/searchposts/' + words;
            axios.get(req, {headers: this.state.headerObject})
                .then((response) => {
                  //console.log(response);
                  let posts = response.data;
                  commit('SET_POSTS_FEED', posts);
                })
                .catch((error) => {
                  console.error(error);
                })
          } else {
            dispatch('getPostsFeed');
          }

        },

        getGroupSearchResult: function({commit, dispatch}, searchData) {
          if (searchData.words != "") {
            let req = 'http://localhost/developeers/public/api/searchgroups/' + searchData.words;
            axios.get(req, {headers: this.state.headerObject})
                .then((response) => {
                  let groups = response.data;
                  commit('SET_GROUPS', groups);
                })
                .catch((error) => {
                  console.error(error);
                })
          } else {
            dispatch('initGroupsListAction', {type: searchData.emptySearchCallback});
          }
        },

        createGroup: function({dispatch}, requestData) {
          axios.post('http://localhost/developeers/public/api/groups', requestData, {headers: this.state.headerObject} )
              . then((response) => {
                console.log(response.data);
                let data = {
                  listType: "group-posts",
                  groupId: response.data
              }
                dispatch('initPostsListAction', data);
              })
              .catch((error) => {
                console.error(error);
              });
        },

        logUser: function({commit, dispatch}, logData) {

          axios.post('http://localhost/developeers/public/api/login', logData)
            .then( (response1) => {

              axios.get('http://localhost/developeers/public/api/user',
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
                      //PROBLEME : perte de connexion en cas de rechargement de la page !!
                      //regarder du côté de 'vuex-persistedstate' pour écrire l'état dans un cookie
                      // setTimeout(function() {
                      //   window.location = "http://localhost/developpeers_front/dist";
                      // }, 500);

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

          axios.post('http://localhost/developeers/public/api/register', registerData)
                .then( (response1) => {

                  console.log(response1);

                    axios.get('http://localhost/developeers/public/api/user',
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
