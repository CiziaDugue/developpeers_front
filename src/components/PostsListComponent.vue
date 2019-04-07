<template>
<div class="container main-block">
    <h2 class="text-center">{{ title }}</h2>
    <div class="card-columns">
        <div v-for="post in postsList" v-bind:key="post._id" class="card p-3">
            <div class="card-body">
                <h5 class="card-title">{{ post.title }}</h5>
                <p class="card-text">This card has a regular title and short paragraphy of text below it.</p>
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
        //
        //     posts: function() {
        //
        //         return this.$store.state.postsList;
        //
        //     }
        //
    },
    mounted: function() {
        this.$store.dispatch('initPostsListAction')
    }
    // methods: {
    //     initializePostsList: function() {
    //
    //         console.log('initializing posts list');
    //
    //         this.posts = this.$store.state.postsList;
    //     }
    // },
    //
    // created: function() {
    //
    //     this.initializePostsList();
    // },
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
