<template>
<main class="main-container">
    <div class="row align-items-center justify-content-center">
        <div class="col-sm-9 col-12 card-bg2 p-5">
            <h2 class="text-center">Dashboard</h2>
        </div>
        <div class="col-sm-3 col-12 card-bg1 align-self-stretch">

        </div>
    </div>

    <!-- Authenticated user posts feed : -->
    <template v-if="userLogged">
        <div v-for="(post,key,index) in postsFeed" v-bind:key="post._id" class="card p-0 m-0 rounded-0">
            <div class="card-body p-0 m-0">
                <div class="row">
                    <div class="col-sm-1 col-2 d-flex flex-column" :class="bg1(key)">
                        <small class="cursor square-btn bg-info text-center pt-1 font-weight-bold" v-on:click="votePost(post, 'post', true)" title="Voter pour cet article">
                            + {{ post.votePros }}
                        </small>
                        <small class="cursor square-btn bg-secondary text-center pt-1 font-weight-bold" v-on:click="votePost(post, 'post', false)" title="Voter contre cet article">- {{ post.voteCons }}</small>
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
                            <div class="col-12 d-flex justify-content-between align-items-center">
                                <p :class="textColor1(key)" class="text-center align-self-middle">
                                    Groupe:
                                    <router-link :to="{ name: 'groupPostsList', params: { groupId: post.group_id } }">{{ post.group_name }}</router-link>
                                </p>
                                <p v-if="authUserData.id == post.author_id" :class="textColor1(key)" class="text-center">
                                    Auteur:
                                    <router-link to="/profil">
                                            {{ post.author_name }}
                                    </router-link>
                                    <router-link to="/profil">
                                            <img class="logo-small" :src="post.author_profile_pic_url">
                                    </router-link>
                                </p>
                                <p v-else :class="textColor1(key)" class="text-center">
                                    Auteur:
                                    <router-link
                                            :to="{ name: 'userPublicProfile', params: {userId: post.author_id, userName: post.author_name.replace(' ', '-')} }">
                                            {{ post.author_name }}
                                    </router-link>
                                    <router-link
                                            :to="{ name: 'userPublicProfile', params: {userId: post.author_id, userName: post.author_name.replace(' ', '-')} }">
                                            <img class="logo-small" :src="post.author_profile_pic_url">
                                    </router-link>
                                </p>
                                <p :class="textColor1(key)" class="text-center align-self-middle">
                                    {{ post.number_of_versions }} Versions
                                </p>
                                <p :class="textColor1(key)">

                                </p>
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
                        <small v-if="!userIsFollowingPost(post.followers)" class="cursor square-btn bg-secondary text-center pt-1" title="Suivre cet article" v-on:click="followPost(post._id)">
                            <!-- <i class="fa fa-eye-slash"></i> -->
                            <i class="far fa-bookmark"></i>
                        </small>
                        <small v-if="userIsFollowingPost(post.followers)" class="cursor square-btn bg-info text-center pt-1" title="Ne plus suivre cet article" v-on:click="unfollowPost(post._id)">
                            <!-- <i class="fa fa-eye"></i> -->
                            <i class="fas fa-bookmark"></i>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    </template>

    <!-- Guest user posts feed : -->
    <template v-if="!userLogged">
        <div v-for="(post,key,index) in postsFeed" v-bind:key="post._id" class="card p-0 m-0 rounded-0">
            <div class="card-body p-0 m-0">
                <div class="row">
                    <div class="col-sm-2 col-2 d-flex flex-column" :class="bg1(key)">
                        <small class="square-btn bg-info text-center pt-1 font-weight-bold">+ {{ post.votePros }}</small>
                        <small class="square-btn bg-secondary text-center pt-1 font-weight-bold">- {{ post.voteCons }}</small>
                    </div>
                    <div class="col-sm-7 col-10 py-4" :class="bg1(key)">
                        <div class="row">
                            <div class="col-12">
                                <router-link :to="{ name: 'guestPostSingle', params: { postId: post._id }}">
                                    <h3 class="card-title">{{ post.title }}</h3>
                                </router-link>
                            </div>
                            <div class="col-12">
                                <p :class="textColor1(key)">{{ post.excerpt }}</p>
                            </div>
                            <div class="col-12 d-flex justify-content-between align-items-center">
                                <p :class="textColor1(key)" class="text-center align-self-middle">
                                    Groupe:
                                    <router-link to="/login">{{ post.group_name }}</router-link>
                                </p>
                                <p :class="textColor1(key)" class="text-center">
                                    Auteur:
                                    <router-link
                                            :to="{ name: 'userPublicProfile', params: {userId: post.author_id, userName: post.author_name.replace(' ', '-')} }">
                                            {{ post.author_name }}
                                    </router-link>
                                    <router-link
                                            :to="{ name: 'userPublicProfile', params: {userId: post.author_id, userName: post.author_name.replace(' ', '-')} }">
                                            <img class="logo-small" :src="post.author_profile_pic_url">
                                    </router-link>
                                </p>
                                <p :class="textColor1(key)" class="text-center align-self-middle">
                                    {{ post.number_of_versions }} Versions
                                </p>
                                <p :class="textColor1(key)">

                                </p>
                            </div>
                            <div class="col-12">
                                <p class="footer-text" :class="textColor1(key)">Créé le {{ post.created_at }} par {{ post.author_name }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-3 col-12 align-self-stetch" :class="bg2(key)">
                        <ul class="card-text list-group list-group-flush py-4">
                            <li class="list-group-item font-weight-light font-italic border-0 bg-transparent" :class="textColor2(key)" v-for="keyword in post.keywords">{{ keyword }}</li>
                        </ul>
                    </div>
                </div>
            </div>
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
            // windowWidth: window.innerWidth
        }
    },
    computed: {
        ...mapState([
            'postsFeed',
            'userLogged',
            'authUserData'
        ]),
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
    // mounted: function() {
    //     window.addEventListener('resize', () => {
    //         this.windowWidth = window.innerWidth;
    //     });
    // }
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
*/
.card-bg2 {
    /* background-color: #8baed3; */
    background-color: #c3d1dd;
}

.card-bg1 {
    /* background-color: #c3d1dd; */
    background-color: #fff;
}

.card-text2 {
    color: #57515b;
}

.card-text1 {
    color: #57515b;
}

/* .square-btn {
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
