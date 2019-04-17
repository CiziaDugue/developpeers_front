<template>
<main class="main-container">
    <h1>Dashboard</h1>

    <!-- Authenticated user posts feed : -->
    <div v-if="userLogged">
        <div v-for="post in postsFeed" v-bind:key="post._id" class="card p-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-8">
                        <router-link :to="{ name: 'postSingle', params: { postId: post._id }}">
                            <h3 class="card-title">{{ post.title }}</h3>
                        </router-link>
                    </div>
                    <div class="col-4">
                        <button class="fas fa-angle-up" v-on:click="votePost(post, 'post', true)"></button>
                        <small class="badge badge-pill badge-success">{{ post.votePros }}</small>
                        <small class="badge badge-pill badge-danger">{{ post.voteCons }}</small>
                        <button class="fas fa-angle-down" v-on:click="votePost(post, 'post', false)"></button>
                    </div>
                </div>
                <ul class="card-text">
                    <li v-for="keyword in post.keywords">{{ keyword }}</li>
                </ul>
                <p class='card-text'>
                    <strong>Groupe :</strong>{{post.group_name}}
                </p>
                <p class="card-text"><small class="text-muted">{{ post.updated_at }}</small></p>
            </div>
        </div>
    </div>

    <!-- Guest user posts feed : -->
    <div v-if="!userLogged">
        <div v-for="post in postsFeed" v-bind:key="post._id" class="card p-3">
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
            'userLogged'
        ])
    },
    methods: {
        getPostsFeed: function() {
            if (this.$store.userLogged) this.$store.dispatch('getPostsFeed');
            else this.$store.dispatch('getGuestFeed');
            // console.log(this.$store.state.headerObject);
        },
        getNotifications: function() {
            if (this.$store.userLogged) {
                this.$store.dispatch('getNotificationsAction');
                // console.log(this.$store.state.userNotifs);
                // console.log(this.userNotifs);
            }
        },
        votePost: function(target, type, vote) {

            let payload = {
                type: type,
                vote: vote,
                target: target
            };

            this.$store.dispatch('voteInFeedAction', payload);
        }
    },
    created: function() {
        this.getPostsFeed();
        this.getNotifications();
    }
}
</script>

<style scoped>
main {
    position: relative;
    left: 50px;
    top: 8vh;
}
</style>
