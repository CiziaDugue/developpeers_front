<template>
<div class="container main-block">
    <div v-if="postSingle == ''" class="container">
        <img src="spinner.gif" alt="Chargement en cours">
    </div>
    <div v-else class="row justify-content-center align-items-center">
        <div class="col-10">
            <div class="row border">
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
            <div class="row border">
                <div class="col-md-6 col-12">
                    <p class="text-center">Auteur: {{ postSingle.author_name }} - Groupe: {{ postSingle.group_name }}</p>
                </div>
                <div class="col-md-6 col-12">
                    <small class="text-center">Créé le {{ postSingle.created_at }}</small>
                </div>
                <div class="col-md-6 col-12">
                    <p class="text-center">
                        Version: {{ postSingle.active_version.number }}
                    </p>
                </div>
                <div class="col-md-6 col-12">
                    <button class="fas fa-angle-up"></button>
                    <small class="badge badge-pill badge-success">{{ postSingle.active_version.votePros }}</small>
                    <small class="badge badge-pill badge-danger">{{ postSingle.active_version.voteCons }}</small>
                    <button class="fas fa-angle-down"></button>
                </div>
            </div>
            <div class="row border">
                <div class="col-12">
                    <p class="text-center">{{ postSingle.active_version.text_content }}</p>
                    <p v-for="snippet in postSingle.active_version.code_snippets" class="border" v-on:click="">
                        {{ snippet.content }}
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <table class="table table-hover table-dark table-responsive">
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
                <div class="col-12">
                    <div class="input-group">
                        <textarea class="form-control" aria-label="With textarea" v-model="commentToAdd"></textarea>
                        <div class="input-group-append">
                            <button class="fas fa-plus" v-on:click="addComment"></button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="col-2 border">

            <button class="btn btn-outline-secondary m-2" v-for="version in postSingle.versions">
                {{ version.number }}
            </button>

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
            commentToAdd: '',
            loading: 'true'
        }
    },
    computed: {
        ...mapState([
            'postSingle'
        ])
    },
    methods: {
        changeVersion: function() {
            this.$store.dispatch('changePostVersionAction', {
                postId: this.$route.params.postId
            })
        },

        addComment: function() {

            if (this.commentToAdd != '') {

                let comment = {
                    author_id: 1,
                    content: this.commentToAdd,
                    created_at: new Date().toISOString().substring(0,19).replace('T',' '),
                    votePros: 0,
                    voteCons: 0
                }
                // UserId temporaire
                let payload = {
                    post_id: this.$store.state.postSingle._id,
                    version_id: this.$store.state.postSingle.active_version._id,
                    comment: comment
                }

                this.$store.dispatch('addCommentAction', payload);

                this.commentToAdd = '';
            }
        }
    },
    mounted: function() {
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
