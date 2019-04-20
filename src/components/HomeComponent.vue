<template>
<main class="main-container">
    <div class="row align-items-center justify-content-center p-2">
        <div class="col-12">
            <h2 class="text-center">Dashboard</h2>
        </div>
    </div>

    <!-- Authenticated user posts feed : -->
    <div v-if="userLogged" class="feedCtnr">
        <div v-for="post in postsFeed" v-bind:key="post._id" class="card p-0 m-0 rounded-0">
            <div class="card-body p-0 m-0">
                <div class="row">
                    <div class="col-1 d-flex flex-column">
                        <small class="cursor square-btn bg-info text-center pt-1" v-on:click="votePost(post, 'post', true)" title="Voter pour cet article">
                            + {{ post.votePros }}
                        </small>
                        <small class="cursor square-btn bg-light text-center pt-1" v-on:click="votePost(post, 'post', false)" title="Voter contre cet article">- {{ post.voteCons }}</small>
                    </div>
                    <div class="col-8 py-4">
                        <div class="row">
                            <div class="col-12">
                                <router-link :to="{ name: 'postSingle', params: { postId: post._id }}">
                                    <h3 class="card-title">{{ post.title }}</h3>
                                </router-link>
                            </div>
                            <div class="col-12">
                                <p>{{ post.excerpt }}</p>
                            </div>
                            <div class="col-12">
                                <p>{{ post.number_of_versions }} versions - groupe <router-link :to="{ name: 'groupPostsList', params: { groupId: post.group_id } }">{{ post.group_name }}</router-link>
                                </p>
                            </div>
                            <div class="col-12">
                                <p class="card-text"><small class="text-muted">Créé le {{ post.created_at }} par {{ post.author_name }}</small></p>
                            </div>
                        </div>
                    </div>


                    <div class="col-2">
                        <ul class="card-text list-group list-group-flush">
                            <li class="list-group-item font-weight-light font-italic border-0 bg-transparent" v-for="keyword in post.keywords">{{ keyword }}</li>
                        </ul>
                    </div>
                    <div class="col-1 d-flex flex-column align-items-end">
                        <small v-if="!userIsFollowingPost(post.followers)" class="cursor square-btn bg-info text-center pt-1" title="Suivre cet article" v-on:click="followPost(post._id)">
                            <i class="fa fa-eye"></i>
                        </small>
                        <small v-if="userIsFollowingPost(post.followers)" class="cursor square-btn bg-info text-center pt-1" title="Ne plus suivre cet article" v-on:click="unfollowPost(post._id)">
                            <i class="fa fa-eye-slash"></i>
                        </small>
                        <!-- <button v-if="!userIsFollowingPost(post.followers)" class="btn btn-secondary rounded-0" type="button" title="Suivre cet article" v-on:click="followPost(post._id)">
                            <i class="fa fa-eye"></i>
                        </button>
                        <button v-if="userIsFollowingPost(post.followers)" class="btn btn-outline-secondary rounded-0" type="button" title="Ne plus suivre cet article" v-on:click="unfollowPost(post._id)">
                            <i class="far fa-eye-slash"></i>
                        </button> -->
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Guest user posts feed : -->
    <div v-if="!userLogged" class="feedCtnr">
        <div v-for="post in postsFeed" v-bind:key="post._id" class="card p-0 m-0 rounded-0">
            <div class="card-body p-0 m-0">
                <div class="row">
                    <div class="col-2 d-flex flex-column">
                        <small class="square-btn bg-info text-center pt-1">+ {{ post.votePros }}</small>
                        <small class="square-btn bg-light text-center pt-1">- {{ post.voteCons }}</small>
                    </div>
                    <div class="col-7 py-4">
                        <div class="row">
                            <div class="col-12">
                                <router-link :to="{ name: 'guestPostSingle', params: { postId: post._id }}">
                                    <h3 class="card-title">{{ post.title }}</h3>
                                </router-link>
                            </div>
                            <div class="col-12">
                                <p>{{ post.excerpt }}</p>
                            </div>
                            <div class="col-12">
                                <p>{{ post.number_of_versions }} versions - groupe {{ post.group_name }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-3 col-12">
                        <ul class="card-text list-group list-group-flush">
                            <li class="list-group-item font-weight-light font-italic border-0 bg-transparent" v-for="keyword in post.keywords">{{ keyword }}</li>
                        </ul>
                    </div>
                    <div class="col-12">
                        <p class="card-text text-center"><small class="text-muted">Créé le {{ post.created_at }} par {{ post.author_name }}</small></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

</main>
</template>

<script>
import {
    mapState
} from 'vuex'

export default {
    data: function() {
        return {

        }
    },
    computed: {
        ...mapState([
            'postsFeed',
            'userLogged',
            'authUserData'
        ])
    },
    methods: {
        userIsFollowingPost: function(followers) {
            return (followers.indexOf(this.authUserData.id) != -1);
        },

        followPost: function(postId) {

            let payload = {
                postId: postId,
                fromPostSingle: false,
                listType: 'userFeed'
            };

            this.$store.dispatch('followPostAction', payload)
                .then((response) => {
                    //
                }, (error) => {
                    console.error(error);
                });
        },

        unfollowPost: function(postId) {

            let payload = {
                postId: postId,
                fromPostSingle: false,
                listType: 'userFeed'
            };

            this.$store.dispatch('unfollowPostAction', payload)
                .then((response) => {
                    //
                }, (error) => {
                    console.error(error);
                });
        },
        getPostsFeed: function() {
            if (!this.$route.params.words) {
                if (this.userLogged) this.$store.dispatch('getPostsFeed');
                else this.$store.dispatch('getGuestFeed');
            }
        },
        votePost: function(target, type, vote) {

            let payload = {
                type: type,
                vote: vote,
                target: target
            };

            this.$store.dispatch('voteInFeedAction', payload);
        },

        getNotifications: function() {
            if (this.$store.userLogged) {
                this.$store.dispatch('getNotificationsAction');
                // console.log(this.$store.state.userNotifs);
                // console.log(this.userNotifs);
            }
        },

        autoLogin: function() {

            this.$store.dispatch('autoLogin')
                .then((response) => {
                    console.log(response);
                    this.getPostsFeed();
                    this.getNotifications();
                }, (error) => {
                    console.log(error);
                    this.getPostsFeed();
                })
        }
    },
    created: function() {
        if (!this.userLogged) {
            this.autoLogin();
        } else {
            this.getPostsFeed();
            this.getNotifications();
        }
    }
}
</script>

<style scoped>
.cursor:hover {
    cursor: pointer;
    transform: scale(1.1);
}

.card-block {
    /* position: relative; */
    /* padding: 15px; */
    /* background-color: #4c5768; */
}

.card:nth-child(odd) {
    background-color: #4c5768;
}

.card:nth-child(even) {
    background-color: #5695f7;
}

.square-btn {
    /* display: block; */
    /* position: absolute; */
    width: 30px;
    height: 30px;
    /* background-color: #fff; */
}

.btn-l-1 {
    top: 0;
    left: 0;
    /* background-color: #fff; */
}
.btn-l-2 {
    bottom: 0;
    left: 20px;
    background-color: #fff;
}

</style>
