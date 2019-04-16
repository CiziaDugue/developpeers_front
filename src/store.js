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
        headerObject:{},
        userGroups: [],
        userNotif: []
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

        SET_GROUPS(state, groups) {

            state.groupsList = groups;

        },

        SET_USER_GROUPS(state, groups) {
          //doublon avec celle du dessus ? essayer de fusionner
          state.userGroups = groups;
        },

        SET_GROUP(state, group) {

          state.groupSingle = group;
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
          //console.log(state.headerObject);
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

        initPostsListAction: function({
            commit,
            dispatch
        }, data) {

            let listType = data.listType;
            let groupId = data.groupId;

            let req = '';

            if (listType == 'tous-les-articles') {

                req = 'http://localhost/developeers/public/api/posts';

            } else if (listType == 'mes-articles') {

                req = 'http://localhost/developeers/public/api/authorposts';

            } else if (listType == 'articles-suivis') {

                req = 'http://localhost/developeers/public/api/userposts';

            } else if (listType == 'group-posts') {

                req = 'http://localhost/developeers/public/api/posts/group/' + groupId;

                dispatch('initGroupSingleAction', groupId);
                console.log(groupId);
            }

            return new Promise((resolve, reject) => {

                axios.get(req, { headers: this.state.headerObject })

                    .then((response) => {
                        //console.log(response.data);
                        let posts = response.data;

                        commit('SET_POSTS', posts);

                        resolve(response);

                    })
                    .catch((error) => {
                        reject(error);
                    });
                });
        },

        initPostSingleAction: function({commit}, payload) {
          return new Promise ((resolve, reject)=>{
            axios.get('http://localhost/developeers/public/api/posts/' + payload.postId, {headers: this.state.headerObject})
                .then(response => {
                    //console.log(response.data);
                    let post = response.data;

                    commit('SET_POST', post);
                    resolve(response);
                })
                .catch(error => {
                    console.log(error)
                    reject(error);
                });
          });
        },

        changePostVersionAction: function({commit}, payload) {

            axios.get('http://localhost/developeers/public/api/posts/' + payload.post_id + '/' + payload.version_id, {
                    headers: this.state.headerObject
                })

                .then(response => {
                    //console.log(response.data);
                    let post = response.data;
                    commit('SET_POST', post);
                })
                .catch(error => {
                    console.log(error)
                });
        },

        addCommentAction: function({dispatch}, payload) {

            axios.post('http://localhost/developeers/public/api/comments/' + payload.version_id, payload.comment, {
                    headers: this.state.headerObject
                })
                .then(response => {
                    //refresh the current version view
                    dispatch('changePostVersionAction', payload);
                })
                .catch(error => {
                    console.log(error)
                });
        },

        voteInPostListAction: function({dispatch}, payload) {

            let req = 'http://localhost/developeers/public/api/vote' + payload.type + '/' + payload.target._id;

            let voteType = {vote: payload.vote};

            axios.put(req, voteType, {headers: this.state.headerObject})

                .then((response) => {

                    //console.log(response.data);
                    //postfeed
                    if (payload.listType == null && payload.groupId == null) {
                        dispatch('getPostsFeed');
                    }

                    //postList
                    else if (payload.listType != null) {
                        let listType = {
                            listType: payload.listType,
                            groupId: null
                        };
                        dispatch('initPostsListAction', listType);
                    }

                    //groupsingle postlist
                    else if (payload.groupId != null) {
                        let groupId = {
                            listType: 'group-posts',
                            groupId: payload.groupId
                        };
                        dispatch('initPostsListAction', groupId);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        voteInPostSingleAction: function({dispatch}, payload) {

            let req = 'http://localhost/developeers/public/api/vote' + payload.type + '/' + payload.target._id;

            let voteType = { vote: payload.vote };

            axios.put(req, voteType, {headers: this.state.headerObject})

                .then((response) => {

                    let postId = {
                        post_id: payload.postId,
                        version_id: payload.versionId
                    };
                    dispatch('changePostVersionAction', postId);

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

            } else if (listType.type == 'mes-groupes') {

                req = 'http://localhost/developeers/public/api/groups/user';

            }

            return new Promise((resolve) => {

                axios.get(req, { headers: this.state.headerObject })

                    .then((response) => {
                        //console.log(response.data);
                        let groups = response.data;

                        commit('SET_GROUPS', groups);
                        resolve();

                    })
                    .catch((error) => {
                        console.log(error);
                    });
                });
        },

        initGroupSingleAction: function({commit}, groupId) {
          axios.get('http://localhost/developeers/public/api/groups/'+groupId, {headers: this.state.headerObject})
              .then((response)=>{
                commit('SET_GROUP', response.data);
              })
              .catch((error)=>{
                console.error(error);
              });
        },


        leaveOrJoinGroupFromListAction: function({ dispatch }, payload) {

            let req = 'http://localhost/developeers/public/api/groups/' + payload.action + '/' + payload.groupId;

            axios.put(req, {}, {
                    headers: this.state.headerObject
                })

                .then((response) => {

                    // console.log(response.data);

                    dispatch('initGroupsListAction', payload);

                })
                .catch((error) => {
                    console.log(error);
                });
        },

        leaveOrJoinGroupFromGroupAction: function({dispatch}, payload) {

            let req = 'http://localhost/developeers/public/api/groups/' + payload.action + '/' + payload.groupId;

            axios.put(req, {}, { headers: this.state.headerObject })

                .then((response) => {
                    // console.log(response.data);
                    dispatch('initPostsListAction', payload);

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

        getUserGroups: function({commit}) {
          //récupérer la list de groups de l'utilisateur (par ex pour le select dans create post)
          axios.get('http://localhost/developeers/public/api/groups/user', {headers: this.state.headerObject})
              .then((response)=> {
                // console.log('GET USER GROUPS');
                // console.log(response.data);
                commit('SET_GROUPS', response.data);
              })
              .catch((error)=>{
                console.error(error);
              });
        },

        createGroup: function({dispatch}, requestData) {
          return new Promise((resolve, reject) => {
            axios.post('http://localhost/developeers/public/api/groups', requestData, {headers: this.state.headerObject} )
                . then((response) => {
                  //console.log(response.data);
                  let data = {
                    listType: "group-posts",
                    groupId: response.data._id
                  };
                  dispatch('initPostsListAction', data);
                  resolve(response);
                })
                .catch((error) => {
                  //console.error(error);
                  reject(error);
                });
          });
        },

        createPost: function({dispatch}, requestData) {
          return  new Promise((resolve, reject) => {
            axios.post('http://localhost/developeers/public/api/posts', requestData, {headers: this.state.headerObject})
                . then((response) => {
                  console.log(response.data);
                  dispatch('initPostSingleAction', {postId: response.data._id});
                  resolve(response);
                })
                .catch((error) => {
                  //console.error(error);
                  reject(error);
                });
          });
        },

        commitVersion: function({commit}) {

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
                      dispatch('getUserGroups');
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
          })
        },

        registerUser: function({commit, dispatch}, registerData) {
          axios.post('http://localhost/developeers/public/api/register', registerData)
                .then( (response1) => {
                  //console.log(response1);
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
                                "token": "bearer " + response1.data.token,
                                "id": response2.data.user.id,
                                "email": response2.data.user.email,
                                "name": response2.data.user.name
                            };

                            commit('SET_AUTH_USER_DATA_IN', userData);
                            dispatch('setHeaderObject', userData);

                        })
                        .catch((error) => {
                            console.log(error);
                        });
                })
                .catch(function(error) {
                    console.log(error);
                });

          //console.log(registerData);
        },

        disconnectUser: function({ commit }) {
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
