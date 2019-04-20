<template>
<div class="main-block">


    <div v-if="isGroupList == false" class="row align-items-center justify-content-center">
        <div class="col-sm-9 col-12 card-bg2 p-5">
            <h2 class="text-center">{{ title }}</h2>
        </div>
        <!-- centrer verticalement!! -->
        <div class="col-sm-3 col-12 card-bg1 align-self-stretch p-5">
            <p class="text-center card-text1">{{ numberOfPosts }} articles</p>
        </div>
    </div>

    <div v-if="isGroupList == true" class="row align-items-center justify-content-center">
        <!-- <div class="col-1 align-self-stretch">
            <small class="cursor badge badge-secondary rounded-0" v-on:click="goBack()">
                <i class="fas fa-angle-left"></i>
            </small>
        </div> -->
        <div class="col-sm-9 col-12 card-bg2 py-5">
            <div class="row align-items-center">
                <div class="col-12">
                    <h2 class="text-center">{{ title }}</h2>
                </div>
                <div class="col-12">
                    <p class="text-center">{{ numberOfMembers }} membres - {{ numberOfPosts }} articles</p>
                </div>
            </div>
        </div>
        <div class="col-sm-2 col-12 card-bg1 align-self-stretch">
            <div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item font-weight-light font-italic border-0 bg-transparent" v-for="word in groupSingle.keywords">{{word}}</li>
                </ul>
            </div>
        </div>
        <div class="col-sm-1 card-bg1 align-self-stretch col-4 d-flex flex-column align-items-end">
            <small class="cursor square-btn bg-primary text-center pt-1" v-on:click="createPost" data-toggle="tooltip" data-placement="down" title="Ajouter un article?">
                <i class="far fa-edit"></i>
            </small>
            <small v-if="isUserInGroup == true" class="cursor square-btn bg-info text-center pt-1" v-on:click="leaveOrJoinGroup('leave')" data-toggle="tooltip" data-placement="left" title="Quitter le groupe?">
                <!-- <i class="fas fa-sign-out-alt"></i> -->
                <!-- <i class="far fa-eye-slash"></i> -->
                <i class="fas fa-bookmark"></i>
            </small>
            <small v-else-if="isUserInGroup == false" class="btn btn-secondary rounded-0" v-on:click="leaveOrJoinGroup('join')" data-toggle="tooltip" data-placement="right" title="Rejoindre le groupe?">
                <!-- <i class="fas fa-sign-in-alt"></i> -->
                <!-- <i class="far fa-eye"></i> -->
                <i class="far fa-bookmark"></i>
            </small>
        </div>
    </div>


    <div v-for="(post, key, index) in postsList" v-bind:key="post._id" class="card p-0 m-0 rounded-0">
        <div class="card-body p-0 m-0">
            <!-- FOLLOW POST BUTTON : -->
            <div class="row">
                <div class="col-sm-1 col-2 d-flex flex-column" :class="bg1(key)">
                    <small class="cursor square-btn bg-info text-center pt-1 font-weight-bold" v-on:click="votePost(post, 'post', true)" title="Voter pour cet article">
                        + {{ post.votePros }}
                    </small>
                    <small class="cursor square-btn bg-secondary text-center pt-1 font-weight-bold" v-on:click="votePost(post, 'post', false)" title="Voter contre cet article">- {{ post.voteCons }}</small>
                    <!-- <small class="cursor badge badge-success rounded-0" v-on:click="votePost(post, 'post', true)">+ {{ post.votePros }}</small>
                    <small class="cursor badge badge-warning rounded-0" v-on:click="votePost(post, 'post', false)">- {{ post.voteCons }}</small> -->
                </div>
                <div class="col-sm-8 col-10 py-4" :class="bg1(key)">
                    <div class="row">
                        <div class="col-12">
                            <router-link :to="{ name: 'postSingle', params: { postId: post._id }}">
                                <h3 class="card-title">{{ post.title }}</h3>
                            </router-link>
                        </div>
                        <div class="col-12">
                            <p :class="textColor1(key)">{{ post.excerpt }}</p>
                        </div>
                        <div v-if="!isGroupList" class="col-12">
                            <p :class="textColor1(key)">{{ post.number_of_versions }} versions - groupe <router-link :to="{ name: 'groupPostsList', params: { groupId: post.group_id } }">{{ post.group_name }}</router-link></p>
                        </div>
                        <div class="col-12">
                            <p class="footer-text" :class="textColor1(key)">Créé le {{ post.created_at }} par {{ post.author_name }}</p>
                        </div>
                    </div>
                </div>
                <div class="col-sm-2 col-8 align-self-stetch" :class="bg2(key)">
                    <ul class="card-text list-group list-group-flush py-4">
                        <li class="list-group-item font-weight-light font-italic border-0 bg-transparent" :class="textColor2(key)" v-for="keyword in post.keywords">{{ keyword }}</li>
                    </ul>
                </div>
                <div class="col-sm-1 col-4 d-flex flex-column align-items-end" :class="bg2(key)">
                    <small v-if="!userIsFollowingPost(post.followers)" title="Suivre cet article" class="cursor square-btn bg-secondary text-center pt-1" v-on:click="followPost(post._id)">
                        <i class="far fa-bookmark"></i>
                    </small>

                    <small v-if="userIsFollowingPost(post.followers)" title="Ne plus suivre cet article" class="cursor square-btn bg-info text-center pt-1" v-on:click="unfollowPost(post._id)">
                        <i class="fas fa-bookmark"></i>
                    </small>
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
            'userLogged',
            'authUserData'
        ]),

        title: function() {
            let title = '';
            if (this.$route.params.postsListType == 'tous-les-articles') {
                title = 'Tous les Articles';
            } else if (this.$route.params.postsListType == 'mes-articles') {
                title = 'Mes Articles';
            } else if (this.$route.params.postsListType == 'articles-suivis') {
                title = 'Articles Suivis';
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
        bg1: function(key) {
            if (key % 2 == 0) {
                return 'card-bg1';
            } else return 'card-bg2';
        },
        bg2: function(key) {
            if (key % 2 == 0) {
                return 'card-bg2';
            } else return 'card-bg1';
        },
        textColor1: function(key) {
            if (key % 2 == 0) {
                return 'card-text2';
            } else return 'card-text1';
        },
        textColor2: function(key) {
            if (key % 2 == 0) {
                return 'card-text1';
            } else return 'card-text2';
        },

        userIsFollowingPost: function(followers) {
            return (followers.indexOf(this.authUserData.id) != -1);
        },

        followPost: function(postId) {
            let payload = {
                    postId: postId,
                    fromPostSingle: false,
                    listType: this.$route.params.postsListType,
                    groupId: this.groupSingle._id
            };
            this.$store.dispatch('followPostAction', payload)
                        .then((response)=>{
                            //console.log(response.data);
                            this.init();
                        }, (error)=>{
                            console.error(error);
                        });
        },

        unfollowPost: function(postId) {
            let payload = {
                    postId: postId,
                    fromPostSingle: false,
                    listType: this.$route.params.postsListType,
                    groupId: this.groupSingle._id
            };
            this.$store.dispatch('unfollowPostAction', payload)
                        .then((response)=>{
                            //console.log(response.data);
                            this.init();
                        }, (error)=>{
                            console.error(error);
                        });
        },

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

            let listType = (to.params.groupId) ? "group-posts" : to.params.postsListType;

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
.card-bg2 {
    /* background-color: #8baed3; */
    background-color: #c3d1dd;
}

.card-bg1 {
    background-color: #fff;
}

.card-text2 {
    color: #57515b;
}

.card-text1 {
    color: #57515b;
}
</style>
