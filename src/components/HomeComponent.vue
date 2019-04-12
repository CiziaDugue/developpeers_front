<template>
  <main class="main-container">
    <h1>Dashboard</h1>
    <div>
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
            this.$store.dispatch('getPostsFeed');
        },
        votePost: function(target, type, vote) {

            let payload = {
                type: type,
                vote: vote,
                target: target,
                listType: null,
                postId: null,
                groupId: null,
            }

            console.log(payload);

            this.$store.dispatch('voteAction', payload);
        }
    },
    created: function() {
        this.getPostsFeed();
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
