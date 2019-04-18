<template>
<div class="main-block">
    <div class="row align-items-center justify-content-center border-bottom mb-2 pb-2 pt-2">
        <div class="col-1 align-self-stretch">
            <button v-if="isGroupList == true" class="fas fa-angle-left" v-on:click="goBack()"></button>
        </div>
        <div class="col-5">
            <div class="row align-items-center">
                <div class="col-12">
                    <h2 class="text-center">{{ title }}</h2>
                </div>
                <div v-if="isGroupList == true" class="col-12">
                    <p class="text-center">{{ numberOfMembers }} membres - {{ numberOfPosts }} articles</p>
                </div>
                <div v-else-if="isGroupList == false" class="col-12">
                    <p class="text-center">{{ numberOfPosts }} articles</p>
                </div>
            </div>
        </div>
        <div class="col-4" v-if="isGroupList">
            <div>
                <!-- Dans ce groupe on parle de : -->
                <ul class="list-group list-group-flush">
                    <li class="list-group-item font-weight-light font-italic border-0" v-for="word in groupSingle.keywords">{{word}}</li>
                </ul>
                <!-- <ul>
                    <li v-for="word in groupSingle.keywords">{{word}}</li>
                </ul> -->
            </div>

        </div>
        <div class="col-2" v-if="isGroupList == true">
            <div class="row">
                <div class="col-12">
                    <button class="btn btn-primary btn-lg mb-2" v-on:click="createPost">Créer un article</button>
                </div>
                <div class="col-12">
                    <button v-if="isGroupList == true && isUserInGroup == true" class="btn btn-outline-secondary btn-lg" v-on:click="leaveOrJoinGroup('leave')">Quitter le groupe</button>
                    <button v-else-if="isGroupList == true && isUserInGroup == false" class="btn btn-secondary btn-lg" v-on:click="leaveOrJoinGroup('join')">Suivre le groupe</button>
                </div>
            </div>
        </div>
    </div>


    <div v-for="post in postsList" v-bind:key="post._id" class="card p-2 mb-2 bg-light">
        <div class="card-body">
            <div class="row">
                <div class="col-2">
                    <!-- <button class="fas fa-angle-up" v-on:click="votePost(post, 'post', true)"></button> -->
                    <small class="cursor badge badge-pill badge-success" v-on:click="votePost(post, 'post', true)">+ {{ post.votePros }}</small>
                    <small class="cursor badge badge-pill badge-warning" v-on:click="votePost(post, 'post', false)">- {{ post.voteCons }}</small>
                    <!-- <button class="fas fa-angle-down" v-on:click="votePost(post, 'post', false)"></button> -->
                </div>
                <div class="col-6">
                    <div class="row">
                        <div class="col-12">
                            <router-link :to="{ name: 'postSingle', params: { postId: post._id }}">
                                <h3 class="card-title">{{ post.title }}</h3>
                            </router-link>
                        </div>
                        <div class="col-12">
                            <p>{{post.excerpt}}</p>

                        </div>
                        <div class="col-12">
                            <p>{{post.number_of_versions}}</p>

                        </div>
                    </div>
                </div>
                <div class="col-4">
                    <ul class="card-text list-group list-group-flush">
                        <li class="list-group-item font-weight-light font-italic border-0" v-for="keyword in post.keywords">{{ keyword }}</li>
                    </ul>
                </div>
                <div class="col-12">
                    <p class="card-text text-center"><small class="text-muted">Créé le {{ post.created_at }} par {{ post.author_name }}</small></p>
                </div>
            </div>
        </div>
    </div>

</div>
</template>

<script>
import {
    mapState
} from 'vuex'

export default {
    data: function() {
        return {
            name: 'PostsListComponent',
            inGroup: false
        }
    },
    computed: {
        ...mapState([
            'postsList',
            'groupSingle',
            'userLogged'
        ]),

        title: function() {
            let title = '';
            if (this.$route.params.postsListType == 'tous-les-articles') {
                title = 'Tous les Articles';
            } else if (this.$route.params.postsListType == 'mes-articles') {
                title = 'Mes Articles';
            } else if (this.$route.params.postsListType == 'articles-suivis') {
                title = 'Mes Articles Suivis';
            } else if (this.$route.params.groupId) {
                title = this.groupSingle.name;
            }
            return title;
        },

        isGroupList: function() {
            let response = this.$route.params.groupId ? true : false;
            //console.log('isGroupList = ' + response);
            return response;
            // return this.$route.params.groupId ? true : false;
        },

        isUserInGroup: function() {
            return this.groupSingle.users_id.includes(this.$store.state.authUserData.id);
        },

        numberOfMembers: function() {
            if (this.isGroupList) {
                return this.groupSingle.users.length;
            }
        },

        numberOfPosts: function() {
            return this.postsList.length;
        }
    },
    methods: {
        votePost: function(target, type, vote) {

            let listType = this.$route.params.postsListType ? this.$route.params.postsListType : null;
            let groupId = this.$route.params.groupId ? this.$route.params.groupId : null;

            let payload = {
                type: type,
                vote: vote,
                target: target,
                listType: listType,
                groupId: groupId
            };

            this.$store.dispatch('voteInPostListAction', payload);
        },

        // numberOfVersions: function(post) {
        //     return post.versions.length;
        // },

        // contentExcerpt: function(content) {
        //     if (content != null) {
        //         let result = '';
        //         if(content.length < 100) {
        //             result = content;
        //         }
        //         else {
        //             result = content.substring(0, 99) + ' [...]';
        //         }
        //         return result;
        //     }
        // },

        goBack: function() {

            this.$router.go(-1);
        },

        leaveOrJoinGroup: function(action) {

            console.log('leaveMeth = ' + this.$route.params.groupId);

            let payload = {
                listType: 'group-posts',
                groupId: this.$route.params.groupId,
                action: action
            }

            this.$store.dispatch('leaveOrJoinGroupFromGroupAction', payload);
        },

        createPost: function() {
            this.$router.push('/creer-un-article/' + this.groupSingle._id);
        },

        getNotifications: function() {
            this.$store.dispatch('getNotificationsAction');
        },

        initPostsList: function(data) {
            // if (data.)
            this.$store.dispatch('initPostsListAction', data);
        },

        init: function() {
            let listType = (this.$route.params.groupId) ? "group-posts" : this.$route.params.postsListType;

            console.log('Initializing ' + listType + ' posts list');

            let groupId = (this.$route.params.groupId) ? this.$route.params.groupId : null;

            let data = {
                groupId: groupId,
                listType: listType
            };
            this.initPostsList(data);
            this.getNotifications();
        }
    },
    created: function() {
        if (!this.userLogged) {
            this.$store.dispatch('autoLogin')
                .then((response) => {
                    this.init();
                }, (error) => {
                    cconsole.error(error);
                    this.$router.push('/login');
                });
        } else {
            this.init();
        }
    },
    watch: {
        '$route': function(to, from) {

            let listType = (to.params.groupId == null) ? to.params.postsListType : "group-posts";

            let groupId = (to.params.groupId) ? to.params.groupId : null;

            let data = {
                groupId: groupId,
                listType: listType
            }

            this.initPostsList(data);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-block {
    /* position: relative;
    right: 0;
    top: 8vh; */
}
.cursor:hover {
    cursor: pointer;
    transform: scale(1.1);
}
</style>
