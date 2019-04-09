<template>
<div class="container main-block">
    <div class="row justify-content-center align-items-center">
        <div class="col-10">
            <div class="row">
                <div class="col-md-6 col-12">
                    <h2 class="text-center">{{ postSingle.title }}</h2>
                </div>
                <div class="col-md-6 col-12">
                    <button class="fas fa-angle-up"></button>
                    <small class="badge badge-pill badge-success">{{ postSingle.votePros }}</small>
                    <small class="badge badge-pill badge-danger">{{ postSingle.voteCons }}</small>
                    <button class="fas fa-angle-down"></button>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-12">
                    <p class="text-center">Auteur: {{ postSingle.author_id }} - Groupe: {{ postSingle.group_id }}</p>
                </div>
                <div class="col-md-6 col-12">
                    <small class="text-center">Créé le {{ postSingle.created_at }}</small>
                </div>
                <div class="col-12">
                    <p class="text-center">
                        Version: {{ postSingle.active_version.number }}
                    </p>
                    <p v-for="snippet in postSingle.active_version.code_snippets" class="text-center">
                        {{ snippet.content }}
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <p class="text-center">{{ postSingle.active_version.text_content }}</p>
                </div>
            </div>
            <div class="row">
                <table class="table table-hover table-dark">
                    <tbody>
                        <tr v-for="comment in postSingle.active_version.comments">
                            <th scope="row">{{ comment.created_at }}</th>
                            <td>{{ comment.author_id }}</td>
                            <td>{{ comment.content }}</td>
                            <td>
                                <button class="fas fa-angle-up"></button>
                                <small class="badge badge-pill badge-success">{{ comment.votePros }}</small>
                                <small class="badge badge-pill badge-danger">{{ comment.voteCons }}</small>
                                <button class="fas fa-angle-down"></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="col-2">
            <ul>
                <li v-for="version in postSingle.versions">
                    <router-link :to="{ name: 'postSingle', params: { postId: postSingle._id, versionId: version._id }}">
                        {{ version.number }}
                    </router-link>
                </li>
            </ul>
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
            name: 'PostSingleComponent',
        }
    },
    computed: {
        ...mapState([
            'postSingle'
        ])
    },
    created: function() {
        this.$store.dispatch('initPostSingleAction', {
            postId: this.$route.params.postId
        })
    },
    // created: function() {
    //
    //     this.initializeList(this.$route.params.userId);
    // },
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
