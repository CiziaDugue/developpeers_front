<template>
<div class="container main-block">
    <h2 class="text-center">{{ title }}</h2>
    <div class="card-columns">
        <div v-for="post in postsList" v-bind:key="post._id" class="card p-3">
            <div class="card-body">
                <router-link :to="{ name: 'postSingle', params: { postId: post._id }}"><h3 class="card-title">{{ post.title }}<span class="badge badge-pill badge-info">{{ post.voteCount }}</span></h3></router-link>
                <ul class="card-text">
                    <li v-for="keyword in post.keywords">{{ keyword }}</li>
                </ul>
                <p class="card-text"><small class="text-muted">{{ post.updated_at }}</small></p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
const axios = require('axios');
import {
    mapState
} from 'vuex'

export default {
    data: function() {
        return {
            name: 'PostsListComponent',
            title: 'Tous les Articles',
        }
    },
    computed: {
        ...mapState([
            'postsList'
        ])
    },
    mounted: function() {
        this.$store.dispatch('initPostsListAction');
    },
    // created: function() {
    //
    //     this.initializeList(this.$route.params.userId);
    // },
    //
    // watch: {
    //     '$route': function(to, from) {
    //
    //         this.initializeList(to.params.userId);
    //     }
    // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-block {
    position: relative;
    right: 0;
    top: 8vh;
}
</style>
