<template>
<main class="main-container">
    <div class="row align-items-center justify-content-center border-bottom mb-2 pb-2 pt-2">
        <div class="col-12">
            <h2 class="text-center">Dashboard</h2>
        </div>
    </div>

    <!-- Authenticated user posts feed : -->
    <div v-if="userLogged">
        <div v-for="post in postsFeed" v-bind:key="post._id" class="card p-2 mb-2 bg-light shadow-sm">
            <div class="card-body">
                <div class="row">
                    <div class="col-2">
                        <small class="cursor badge badge-pill badge-success" v-on:click="votePost(post, 'post', true)">+ {{ post.votePros }}</small>
                        <small class="cursor badge badge-pill badge-warning" v-on:click="votePost(post, 'post', false)">- {{ post.voteCons }}</small>
                    </div>
                    <div class="col-6">
                        <div class="row">
                            <div class="col-12">
                                <router-link :to="{ name: 'postSingle', params: { postId: post._id }}">
                                    <h3 class="card-title">{{ post.title }}</h3>
                                </router-link>
                            </div>
                            <div class="col-12">
                                <p>{{ post.excerpt }}</p>
                            </div>
                            <div v-if="!isGroupList" class="col-12">
                                <div class="row">
                                    <div class="col-6">
                                        <p>Groupe <router-link :to="{ name: 'groupPostsList', params: { groupId: post.group_id } }">{{ post.group_name }}</router-link></p>
                                    </div>
                                    <div class="col-6">
                                        <p class="text-right">{{ post.number_of_versions }} versions</p>
                                    </div>
                                </div>
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

    <!-- Guest user posts feed : -->
    <div v-if="!userLogged">
        <div v-for="post in postsFeed" v-bind:key="post._id" class="card p-2 mb-2 bg-light shadow-sm">
            <div class="card-body">
                <div class="row">
                    <div class="col-2">
                        <small class="badge badge-pill badge-success">+ {{ post.votePros }}</small>
                        <small class="badge badge-pill badge-warning">- {{ post.voteCons }}</small>
                    </div>
                    <div class="col-6">
                        <div class="row">
                            <div class="col-12">
                                <router-link :to="{ name: 'guestPostSingle', params: { postId: post._id }}">
                                    <h3 class="card-title">{{ post.title }}</h3>
                                </router-link>
                            </div>
                            <div class="col-12">
                                <p>{{ post.excerpt }}</p>
                            </div>
                            <div v-if="!isGroupList" class="col-12">
                                <div class="row">
                                    <div class="col-6">
                                        <p>Groupe {{ post.group_name }}</p>
                                    </div>
                                    <div class="col-6">
                                        <p class="text-right">{{ post.number_of_versions }} versions</p>
                                    </div>
                                </div>
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
        <!-- <div v-for="post in postsFeed" v-bind:key="post._id" class="card p-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-8">
                        <router-link :to="{ name: 'guestPostSingle', params: { postId: post._id }}">
                            <h3 class="card-title">{{ post.title }}</h3>
                        </router-link>
                    </div>
                    <div class="col-4">
                        <small class="badge badge-pill badge-success">{{ post.votePros }}</small>
                        <small class="badge badge-pill badge-danger">{{ post.voteCons }}</small>
                    </div>
                </div>
                <ul class="card-text">
                    <li v-for="keyword in post.keywords">{{ keyword }}</li>
                </ul>
                <p class='card-text'>
                    <strong>Groupe :</strong>{{post.group_name}}
                </p>
                <p class="card-text"><small class="text-muted">{{ post.created_at }}</small></p>
            </div>
        </div> -->
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
            'userLogged'
        ])
    },
    methods: {
        getPostsFeed: function() {
            if(!this.$route.params.words) {
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
            .then((response)=>{
                console.log(response);
                this.getPostsFeed();
                this.getNotifications();
            }, (error)=>{
                console.log(error);
                this.getPostsFeed();
            })
        }
    },
    created: function() {
        if(!this.userLogged) {
            this.autoLogin();
        } else {
            this.getPostsFeed();
            this.getNotifications();
        }
    }
}
</script>

<style scoped>
main {
    /* position: relative;
    left: 50px;
    top: 8vh; */
}
.cursor:hover {
    cursor: pointer;
    transform: scale(1.1);
}
</style>
