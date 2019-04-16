<template>
<div class="container main-block">
    <div v-if="postSingle == ''" class="container">
        <img src="@/assets/spinner.gif" alt="Chargement en cours">
    </div>
    <div v-else class="row justify-content-center align-items-center">
        <div class="col-10">
            <div class="row border">
                <div class="col-md-6 col-12">
                    <button class="fas fa-angle-left" v-on:click="goBack()"></button>
                    <!-- <button v-if="postSingle.active_version.created_at != postSingle.active_version.updated_at" class="fas fa-angle-left" v-on:click="goBack()"></button> -->
                    <h2 class="text-center">{{ postSingle.title }}</h2>
                </div>
                <div class="col-md-6 col-12">
                    <button class="fas fa-angle-up" v-on:click="voteTarget(postSingle, 'post', true, postSingle.active_version._id)"></button>
                    <small class="badge badge-pill badge-success">{{ postSingle.votePros }}</small>
                    <small class="badge badge-pill badge-danger">{{ postSingle.voteCons }}</small>
                    <button class="fas fa-angle-down" v-on:click="voteTarget(postSingle, 'post', false, postSingle.active_version._id)"></button>
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
                    <button class="fas fa-angle-up" v-on:click="voteTarget(postSingle.active_version, 'version', true, postSingle.active_version._id)"></button>
                    <small class="badge badge-pill badge-success">{{ postSingle.active_version.votePros }}</small>
                    <small class="badge badge-pill badge-danger">{{ postSingle.active_version.voteCons }}</small>
                    <button class="fas fa-angle-down" v-on:click="voteTarget(postSingle.active_version, 'version', false, postSingle.active_version._id)"></button>
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
        </div>
        <div class="col-2 border">

            <div class="row">
                <div v-for="version in postSingle.versions" class="col-12">
                    <button v-if="postSingle.active_version._id == version._id" class="btn btn-outline-primary" disabled>
                        {{ version.number }}
                    </button>
                    <button v-else v-on:click="changeVersion(version._id)" class="btn btn-outline-secondary">
                        {{ version.number }}
                    </button>
                </div>
                <div class="col-12">
                    <router-link :to="{ name: '', params: {} }">
                        <button class="btn btn-outline-secondary">+</button>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <table class="table table-hover table-dark">
                <tbody>
                    <tr v-for="comment in postSingle.active_version.comments">
                        <th scope="row">{{ comment.created_at }}</th>
                        <td>{{ comment.author_name }}</td>
                        <td>{{ comment.content }}</td>
                        <td>
                            <button class="fas fa-angle-up" v-on:click="voteTarget(comment, 'comment', true, postSingle.active_version._id)"></button>
                            <small class="badge badge-pill badge-success">{{ comment.votePros }}</small>
                            <small class="badge badge-pill badge-danger">{{ comment.voteCons }}</small>
                            <button class="fas fa-angle-down" v-on:click="voteTarget(comment, 'comment', false, postSingle.active_version._id)"></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="col-12">
            <div class="input-group">
                <textarea class="form-control" aria-label="With textarea" v-model="commentToAdd"></textarea>
                <div class="input-group-append">
                    <button class="fas fa-plus" v-on:click="addComment()"></button>
                </div>
            </div>
        </div>

    </div>
</div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    data: function() {
        return {
            name: 'PostSingleComponent',
            commentToAdd: ''
        }
    },
    computed: {
        ...mapState([
            'postSingle'
        ])
    },
    methods: {
        changeVersion: function(version_id) {

            let payload = {
                post_id: this.postSingle._id,
                version_id: version_id
            }

            this.$store.dispatch('changePostVersionAction', payload)
        },

        addComment: function() {

            if (this.commentToAdd != '') {

                let comment = {
                    content: this.commentToAdd,
                }

                let payload = {
                    post_id: this.postSingle._id,
                    version_id: this.postSingle.active_version._id,
                    comment: comment
                }

                this.$store.dispatch('addCommentAction', payload);

                this.commentToAdd = '';
            }
        },

        voteTarget: function(target, type, vote, activeVersionId) {

            let postId = this.$route.params.postId ? this.$route.params.postId : null;
            let payload = {
                type: type,
                vote: vote,
                target: target,
                postId: postId,
                versionId: activeVersionId
            }
            //console.log(payload);
            this.$store.dispatch('voteInPostSingleAction', payload);
        },

        goBack: function() {
            this.$router.go(-1);
        },

        createVersion: function() {
          //this.$router.push('createVersion');
        }
    },
    mounted: function() {
        this.$store.dispatch('initPostSingleAction', {
            postId: this.$route.params.postId
        })
        .then((response) => {
          console.log(response);
          //console.log(this.postSingle);
        }, (error) => {
          console.error(error);
        });
        //console.log(this.postSingle);

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
