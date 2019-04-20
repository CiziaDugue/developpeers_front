<template>
<main class="main-container">
    <div class="row align-items-center justify-content-center p-2">
        <div class="col-12">
            <h2 class="text-center">Dashboard</h2>
        </div>
    </div>

    <!-- Authenticated user posts feed : -->
    <template v-if="userLogged">
        <div v-for="(post,key,index) in postsFeed" v-bind:key="post._id" class="card p-0 m-0 rounded-0">
            <div class="card-body p-0 m-0">
                <div class="row">
                    <template v-if="key % 2">
                        <div class="col-1 d-flex card-bg1 flex-column">
                            <small class="cursor square-btn bg-info text-center pt-1" v-on:click="votePost(post, 'post', true)" title="Voter pour cet article">
                                + {{ post.votePros }}
                            </small>
                            <small class="cursor square-btn bg-light text-center pt-1" v-on:click="votePost(post, 'post', false)" title="Voter contre cet article">- {{ post.voteCons }}</small>
                        </div>
                        <div class="col-8 card-bg1 py-4">
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
                                    <p>{{ post.number_of_versions }} versions - Groupe <router-link :to="{ name: 'groupPostsList', params: { groupId: post.group_id } }">{{ post.group_name }}</router-link>
                                    </p>
                                </div>
                                <div class="col-12">
                                    <p class="footer-text">Créé le {{ post.created_at }} par {{ post.author_name }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-2 card-bg2">
                            <ul class="card-text list-group list-group-flush">
                                <li class="list-group-item font-weight-light font-italic border-0 bg-transparent" v-for="keyword in post.keywords">{{ keyword }}</li>
                            </ul>
                        </div>
                        <div class="col-1 d-flex flex-column align-items-end card-bg2">
                            <small v-if="!userIsFollowingPost(post.followers)" class="cursor square-btn bg-info text-center pt-1" title="Suivre cet article" v-on:click="followPost(post._id)">
                                <i class="fa fa-eye"></i>
                            </small>
                            <small v-if="userIsFollowingPost(post.followers)" class="cursor square-btn bg-info text-center pt-1" title="Ne plus suivre cet article" v-on:click="unfollowPost(post._id)">
                                <i class="fa fa-eye-slash"></i>
                            </small>
                        </div>
                    </template>
                    <template v-else-if="!(key % 2)">
                        <div class="col-sm-1 col-2 card-bg2 d-flex flex-column">
                            <small class="cursor square-btn bg-info text-center pt-1" v-on:click="votePost(post, 'post', true)" title="Voter pour cet article">
                                + {{ post.votePros }}
                            </small>
                            <small class="cursor square-btn bg-light text-center pt-1" v-on:click="votePost(post, 'post', false)" title="Voter contre cet article">- {{ post.voteCons }}</small>
                        </div>
                        <div class="col-sm-8 col-10 card-bg2 py-4">
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
                                    <p>{{ post.number_of_versions }} versions - Groupe <router-link :to="{ name: 'groupPostsList', params: { groupId: post.group_id } }">{{ post.group_name }}</router-link>
                                    </p>
                                </div>
                                <div class="col-12">
                                    <p class="footer-text">Créé le {{ post.created_at }} par {{ post.author_name }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-2 col-8 card-bg1">
                            <ul class="card-text list-group list-group-flush">
                                <li class="list-group-item font-weight-light font-italic border-0 bg-transparent" v-for="keyword in post.keywords">{{ keyword }}</li>
                            </ul>
                        </div>
                        <div class="col-sm-1 col-4 d-flex flex-column align-items-end card-bg1">
                            <small v-if="!userIsFollowingPost(post.followers)" class="cursor square-btn bg-info text-center pt-1" title="Suivre cet article" v-on:click="followPost(post._id)">
                                <i class="fa fa-eye"></i>
                            </small>
                            <small v-if="userIsFollowingPost(post.followers)" class="cursor square-btn bg-info text-center pt-1" title="Ne plus suivre cet article" v-on:click="unfollowPost(post._id)">
                                <i class="fa fa-eye-slash"></i>
                            </small>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </template>

    <!-- Guest user posts feed : -->
    <template v-if="!userLogged">
        <div v-for="(post,key,index) in postsFeed" v-bind:key="post._id" class="card p-0 m-0 rounded-0">
            <template v-if="key % 2">
                <div class="card-body p-0 m-0">
                    <div class="row">
                        <div class="col-2 card-bg1 d-flex flex-column">
                            <small class="square-btn bg-info text-center pt-1">+ {{ post.votePros }}</small>
                            <small class="square-btn bg-light text-center pt-1">- {{ post.voteCons }}</small>
                        </div>
                        <div class="col-7 card-bg1 py-4">
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
                                <div class="col-12">
                                    <p class="card-text text-center"><small class="text-muted">Créé le {{ post.created_at }} par {{ post.author_name }}</small></p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-3 card-bg2 col-12">
                            <ul class="card-text list-group list-group-flush">
                                <li class="list-group-item font-weight-light font-italic border-0 bg-transparent" v-for="keyword in post.keywords">{{ keyword }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else-if="!(key % 2)">
                <div class="card-body p-0 m-0">
                    <div class="row">
                        <div class="col-2 card-bg2 d-flex flex-column">
                            <small class="square-btn bg-info text-center pt-1">+ {{ post.votePros }}</small>
                            <small class="square-btn bg-light text-center pt-1">- {{ post.voteCons }}</small>
                        </div>
                        <div class="col-7 card-bg2 py-4">
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
                                <div class="col-12">
                                    <p class="card-text text-center"><small class="text-muted">Créé le {{ post.created_at }} par {{ post.author_name }}</small></p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-3 card-bg1 col-12">
                            <ul class="card-text list-group list-group-flush">
                                <li class="list-group-item font-weight-light font-italic border-0 bg-transparent" v-for="keyword in post.keywords">{{ keyword }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </template>

</main>
</template>

<script>
import {
    mapState
} from 'vuex'

export default {
    data: function() {
        return {
            // isOdd = true,
            // isEven = false,
            // windowWidth: window.innerWidth
        }
    },
    computed: {
        ...mapState([
            'postsFeed',
            'userLogged',
            'authUserData'
        ]),
        // isOdd: function(key) {
        //     return (key % 2) ? true : false;
        // },
        // bg: function(key) {
        //     if (key % 2 == 0) {
        //         return 'card-bg1';
        //     } else return 'card-bg2';
        // },
        // smallWindowMode () {
        //     return this.windowWidth <= 1100;
        // }
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
    },
    mounted: function() {
        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth;
        });
    }
}
</script>

<style scoped>
/* .cursor:hover {
    cursor: pointer;
    transform: scale(1.1);
}

h2, h3, .square-btn, a, a:hover {
    color: #193052;
}

a:hover, h3:hover {
    font-weight: 600;
    text-decoration: none;
}

p {
    color: #fff;
}

.footer-text {
    text-align: center;
    font-size: 0.8em;
    font-style: italic;
}

.card-bg1 {
    background-color: #8baed3;
}

.card-bg2 {
    background-color: #c3d1dd;
}

.square-btn {
    width: 30px;
    height: 30px;
}

.btn-l-1 {
    top: 0;
    left: 0;
}

.btn-l-2 {
    bottom: 0;
    left: 20px;
} */
</style>
