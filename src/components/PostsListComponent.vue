<template>
<div class="container main-block">
    <h2 class="text-center">{{ title }}</h2>

    <ul>
        <li v-for="post in posts" v-bind:key="post.id">{{ post.title }} <button class="btn btn-danger btn-sm">-</button></li>
    </ul>
</div>
</template>

<script>
const axios = require('axios');

export default {
    data: function() {
        return {
            name: 'PostsListComponent',
            title: 'Tous les Articles',

        }
    },
    // computed: {
    //
    //     posts: function() {
    //
    //         return this.$store.state.postsList;
    //
    //     }
    //
    // },
    methods: {
        initializePostsList: function() {

            console.log('initializing posts list');

            this.posts = this.$store.state.postsList;
        }
    },

    created: function() {

        this.initializePostsList();
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-block {
    position: fixed;
    right: 0;
    top: 8vh;
}
</style>
