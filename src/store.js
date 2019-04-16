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
        userNotifs: []
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
        },
        SET_USER_NOTIFS(state, notifs) {

            state.userNotifs = notifs;
        }
    },
    actions: {

        initPostsListAction: function({commit, dispatch}, payload) {

            let listType = payload.listType;
            let groupId = payload.groupId;

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
                    let post = response.data;
                    commit('SET_POST', post);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
          });
        },

        changePostVersionAction: function({commit}, payload) {
          return new Promise ((resolve, reject)=>{
            axios.get('http://localhost/developeers/public/api/posts/' + payload.post_id + '/' + payload.version_id, {
                    headers: this.state.headerObject
                })
                .then(response => {
                    let post = response.data;
                    commit('SET_POST', post);
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
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

        voteInFeedAction: function({dispatch}, payload) {

            let req = 'http://localhost/developeers/public/api/vote' + payload.type + '/' + payload.target._id;

            let voteType = {
                vote: payload.vote
            };

            axios.put(req, voteType, {
                    headers: this.state.headerObject
                })

                .then((response) => {

                    dispatch('getPostsFeed');
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

        voteInPostListAction: function({dispatch}, payload) {

            let req = 'http://localhost/developeers/public/api/vote' + payload.type + '/' + payload.target._id;

            let voteType = {vote: payload.vote};

            axios.put(req, voteType, {headers: this.state.headerObject})

                .then((response) => {

                    //postList
                    if (payload.listType != null) {
                        let listType = {
                            listType: payload.listType,
                            groupId: null
                        };
                        dispatch('initPostsListAction', listType);
                    }
                    else if (payload.postId != null) {
                        let postId = {
                            postId: payload.postId
                        };
                        dispatch('initPostSingleAction', postId);
                    }
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
                        let groups = response.data;

                        commit('SET_GROUPS', groups);
                        resolve(response);

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
                    dispatch('initPostsListAction', payload);

                })
                .catch((error) => {
                    console.log(error);
                });
        },

        getPostsFeed: function({commit, dispatch}) {
            return new Promise((resolve, reject)=>{
                axios.get('http://localhost/developeers/public/api/postsfeed', {headers: this.state.headerObject})
                    .then( (response) => {
                        let posts = response.data;
                        dispatch('getNotificationsAction');
                        commit('SET_POSTS_FEED', posts);
                        resolve(response);
                    })
                    .catch( (error) => {
                        console.error(error);
                        reject(error);
                    });
            });
        },

        getSearchResult: function({commit, dispatch}, words) {
            return new Promise((resolve, reject)=>{
                if (words != "") {
                  let req = 'http://localhost/developeers/public/api/searchposts/' + words;
                  axios.get(req, {headers: this.state.headerObject})
                      .then((response) => {
                        let posts = response.data;
                        commit('SET_POSTS_FEED', posts);
                        resolve(response);
                      })
                      .catch((error) => {
                        console.error(error);
                        reject(error);
                      })
                } else {
                  dispatch('getPostsFeed')
                  .then((response)=>{
                      resolve(response);
                  }, (error)=>{
                      reject(error);
                  });
                }
            });
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
          return new Promise((resolve, reject)=>{
              axios.get('http://localhost/developeers/public/api/groups/user', {headers: this.state.headerObject})
                  .then((response)=> {
                    commit('SET_GROUPS', response.data);
                    resolve(response);
                  })
                  .catch((error)=>{
                    //console.error(error);
                    reject(error);
                  });
          });
        },

        createGroup: function({dispatch}, requestData) {
          return new Promise((resolve, reject) => {
            axios.post('http://localhost/developeers/public/api/groups', requestData, {headers: this.state.headerObject} )
                . then((response) => {
                  let data = {
                    listType: "group-posts",
                    groupId: response.data._id
                  };
                  dispatch('initPostsListAction', data)
                  .then((response)=>{
                    resolve(response);
                  }, (error)=>{
                    console.error(error);
                  });
                })
                .catch((error) => {
                  reject(error);
                });
          });
        },

        createPost: function({dispatch}, requestData) {
          return  new Promise((resolve, reject) => {
            axios.post('http://localhost/developeers/public/api/posts', requestData, {headers: this.state.headerObject})
                . then((response) => {
                  dispatch('initPostSingleAction', {postId: response.data._id})
                  .then((response)=>{
                    resolve(response);
                  }, (error)=>{
                    console.error(error);
                  });
                })
                .catch((error) => {
                  reject(error);
                });
          });
        },

        commitVersion: function({dispatch}, data) {

          let postId = data.postId;
          let requestData = data.requestData;

          return new Promise((resolve, reject)=>{
            axios.post('http://localhost/developeers/public/api/commitversion/'+postId,
            requestData,
            {headers: this.state.headerObject})
            .then(response=>{
              dispatch('initPostSingleAction', {postId: postId})
              .then((response)=>{
                resolve(response);
              }, (error)=>{
                console.error(error);
              });
            })
            .catch(error=>{
              reject(error);
            })
          });
        },

        updatePost: function({dispatch}, payload) {

          let postId = payload.post_id;
          let requestData = payload.requestData;

          return new Promise((resolve, reject)=>{
            axios.put('http://localhost/developeers/public/api/posts/'+postId,
            requestData,
            {headers: this.state.headerObject})
            .then(response=>{
              dispatch('changePostVersionAction', payload)
              .then((response)=>{
                resolve(response);
              }, (error)=>{
                console.error(error);
              });
            })
            .catch(error=>{
              reject(error);
            });
          });
        },

        updateVersion: function({dispatch}, payload) {
          let versionId = payload.version_id;
          let requestData = payload.requestData;
          return new Promise((resolve, reject)=>{
            axios.put('http://localhost/developeers/public/api/updateversion/'+versionId,
            requestData, {headers: this.state.headerObject})
            .then(response=>{
              resolve(response);
              console.log(response);
            })
            .catch(error=>{
              reject(error);
            });
          });
        },

        deletePost: function({commit}, postId) {
          return new Promise((resolve, reject)=>{
            axios.delete('http://localhost/developeers/public/api/posts/'+postId, {headers: this.state.headerObject})
            .then(response=>{
              resolve(response);
            })
            .catch(error=>{
              reject(error);
            });
          });
        },

        deleteVersion: function({commit}, versionId) {
          return new Promise((resolve, reject)=>{
            axios.delete('http://localhost/developeers/public/api/deleteversion/'+versionId, {headers: this.state.headerObject})
            .then(response=>{
              resolve(response);
            })
            .catch(error=>{
              reject(error);
            });
          })
        },

        updateComment: function({dispatch}, payload) {
          let commentId = payload.commentId;
          let requestData = payload.requestData;
          return new Promise((resolve, reject)=>{
            axios.put('http://localhost/developeers/public/api/updatecomment/'+commentId, requestData, {headers: this.state.headerObject})
            .then(response=>{
              dispatch('changePostVersionAction', payload)
              .then((response)=>{
                resolve(response);
              }, (error)=>{
                console.error(error);
              });
            })
            .catch(error=>{ostSin
              reject(error);
            });
          });
        },

        deleteComment: function({dispatch}, payload) {
          return new Promise((resolve, reject)=>{
            axios.delete('http://localhost/developeers/public/api/deletecomment/'+payload.commentId, {headers: this.state.headerObject})
            .then((response)=>{
              dispatch('changePostVersionAction', {post_id: payload.postId, version_id: payload.versionId})
              .then((response)=>{
                resolve(response);
              }, (error)=>{
                console.error(error);
              });
            })
            .catch((error)=>{
              reject(error);
            });
          });
        },

        logUser: function({commit, dispatch}, logData) {
            return new Promise((resolve, reject)=> {
                axios.post('http://localhost/developeers/public/api/login', logData)
                  .then( (response1) => {

                    localStorage.developeersAccessToken = response1.data.token;

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

                            localStorage.developeersUserId = response2.data.user.id;
                            localStorage.developeersUserName = response2.data.user.name;
                            localStorage.developeersUserEmail = response2.data.user.email

                            commit('SET_AUTH_USER_DATA_IN', userData);
                            dispatch('setHeaderObject', userData);
                            dispatch('getUserGroups')
                            .then((response3)=>{
                                resolve(response3);
                            }, (error)=>{
                                console.error(error);
                            });

                            //PROBLEME : perte de connexion en cas de rechargement de la page !!
                            //regarder du côté de 'vuex-persistedstate' pour écrire l'état dans un cookie

                        })
                        .catch( (error) => {
                            console.log(error);
                        });
                  })
                  .catch(function (error) {
                    console.log(error);
                    reject(error);
                })
            });
        },

        registerUser: function({commit, dispatch}, registerData) {
            return new Promise((resolve, reject)=>{
                axios.post('http://localhost/developeers/public/api/register', registerData)
                      .then( (response1) => {

                          localStorage.developeersAccessToken = response1.data.token;

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
                                      "token": "Bearer " + response1.data.token,
                                      "id": response2.data.user.id,
                                      "email": response2.data.user.email,
                                      "name": response2.data.user.name
                                  };

                                  localStorage.developeersUserId = response2.data.user.id;
                                  localStorage.developeersUserName = response2.data.user.name;
                                  localStorage.developeersUserEmail = response2.data.user.email

                                  commit('SET_AUTH_USER_DATA_IN', userData);
                                  dispatch('setHeaderObject', userData);
                                  resolve(response2);

                              })
                              .catch((error) => {
                                  console.error(error);
                              });
                      })
                      .catch(function(error) {
                          console.error(error);
                          reject(error);
                      });
            });
        },

        disconnectUser: function({commit}) {
            console.log("store.disconnect");
            let headerObject = {
                'Content-Type': 'application/json'
            };

            localStorage.removeItem('developeersAccessToken');
            localStorage.removeItem('developeersUserId');
            localStorage.removeItem('developeersUserName');
            localStorage.removeItem('developeersUserEmail');

            commit('SET_AUTH_USER_DATA_OUT', headerObject);
        },

        autoLogin: function({commit, dispatch}) {

            return new Promise ((resolve, reject) => {

                if (localStorage.developeersAccessToken
                && localStorage.developeersUserId
                && localStorage.developeersUserName
                && localStorage.developeersUserEmail) {

                    let userData = {
                        "token": "Bearer " + localStorage.developeersAccessToken,
                        "id": parseInt(localStorage.developeersUserId),
                        "email": localStorage.developeersUserEmail,
                        "name": localStorage.developeersUserName
                    };
                    commit('SET_AUTH_USER_DATA_IN', userData);
                    dispatch('setHeaderObject', userData);

                    resolve("Autologin succeded !");

                } else {
                    reject("Autologin failed.");
                }
            });
        },

        setHeaderObject: function({commit}, userData) {
            let headerObject = {
                'Authorization': userData.token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };
            commit('SET_HEADER_OBJECT', headerObject);
            console.log('setting header object');
        },

        getNotificationsAction: function({commit}) {
            axios.get('http://localhost/developeers/public/api/notifications', {headers: this.state.headerObject})
                .then( (response) => {
                    let notifs = response.data;
                    commit('SET_USER_NOTIFS', notifs);
                })
                .catch( (error) => {
                    console.error(error);
                });
        },

        //GUEST CIRCUIT
        getGuestFeed: function({commit}) {
            return new Promise((resolve, reject)=>{
                axios.get('http://localhost/developeers/public/api/guest/postsfeed', {headers: this.state.headerObject})
                    .then( (response) => {
                        let posts = response.data;
                        commit('SET_POSTS_FEED', posts);
                        resolve(response);
                    })
                    .catch( (error) => {
                        console.error(error);
                        reject(error);
                    });
            });
        },

        getGuestSearchResults: function({commit, dispatch}, words) {
            return new Promise((resolve, reject)=> {
                if (words != "") {
                  let req = 'http://localhost/developeers/public/api/guest/searchposts/' + words;
                  axios.get(req, {headers: this.state.headerObject})
                      .then((response) => {
                        let posts = response.data;
                        commit('SET_POSTS_FEED', posts);
                        resolve(response);
                      })
                      .catch((error) => {
                        console.error(error);
                        reject(error);
                      })
                } else {
                  dispatch('getGuestFeed')
                  .then((response)=>{
                      resolve(response);
                  }, (error)=>{
                      console.error(error);
                      reject(error);
                  });
                }
            });

        },

        initGuestPostSingleAction: function({commit}, payload) {
            return new Promise ((resolve, reject)=>{
              axios.get('http://localhost/developeers/public/api/guest/posts/' + payload.postId, {headers: this.state.headerObject})
                  .then((response) => {
                      let post = response.data;
                      commit('SET_POST', post);
                      resolve(response);
                  })
                  .catch((error) => {
                      reject(error);
                  });
            });
        },

        changeGuestPostVersionAction: function({commit}, payload) {
            return new Promise ((resolve, reject)=>{
              axios.get('http://localhost/developeers/public/api/guest/postversion/' + payload.post_id + '/' + payload.version_id, {
                      headers: this.state.headerObject
                  })
                  .then(response => {
                      let post = response.data;
                      commit('SET_POST', post);
                      resolve(response);
                  })
                  .catch(error => {
                      reject(error);
                  });
            });
        },

        initGuestPostsListAction: function({commit}, payload) {
            //si affichage d'un groupe. à voir ...
        }
    }
})
