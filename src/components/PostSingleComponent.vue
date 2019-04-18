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

                    <div v-if="postEditMode">
                        <label>Modifier le titre : </label>
                        <input type="text" v-model="postEditedTitle">
                    </div>

                    <div>
                        <span>Mot clés :</span>
                        <ul>
                            <li v-for="word in this.postSingle.keywords">{{word}}</li>
                        </ul>

                        <div v-if="postEditMode">
                            <label>Modifier les mots-clés : </label>
                            <input type="text" v-model="postEditedKeywords">
                        </div>
                    </div>

                    <div v-if="postEditMode">
                        <button class="btn btn-sm btn-success" v-on:click="validatePostUpdate">Valider les changements</button>
                    </div>

                    <div v-if="userIsAuthorOfPost">
                        <button class="btn btn-secondary btn-sm" title="Éditer cet article" v-on:click="toggleEditMode">Edit</button>
                        <button class="btn btn-danger btn-sm" title="Supprimer cet article" v-on:click="deletePost">Suppr</button>
                    </div>

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
                        Version: {{ postSingle.active_version.number }}, proposée par {{postSingle.active_version.author_name}}
                    </p>

                    <div v-if="userIsAuthorOfActiveVersion">
                        <button class="btn btn-secondary btn-sm" title="Éditer cette version" v-on:click="editActiveVersion">Edit</button>
                        <button class="btn btn-danger btn-sm" title="supprimer cette version" v-on:click="deleteActiveVersion" v-if="postSingle.active_version.number != '1.0'">Suppr</button>
                    </div>

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
                    <!-- <p class="text-center">{{ postSingle.active_version.text_content }}</p> -->
                    <p v-html="'<pre>'+postSingle.active_version.text_content +'</pre>'"></p>
                    <div v-for="snippet in postSingle.active_version.code_snippets" class="border">
                        <pre v-highlightjs="snippet.content"><code></code></pre>
                    </div>
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
                    <button class="btn btn-outline-secondary" v-on:click="createVersion">+</button>
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
                        <td v-if="comment._id != editedCommentId || !commentEditMode" class="commentContent" v-html="'<pre>'+comment.content+'</pre>'"></td>
                        <td v-if="commentEditMode && comment._id==editedCommentId">
                            <!-- <input type="text" v-model="commentEditedContent"> -->
                            <textarea-autosize v-model="commentEditedContent"></textarea-autosize>
                            <button type="button" class="btn btn-sm btn-success" v-on:click="validateCommentUpdate(comment._id)">Ok</button>
                        </td>
                        <td>
                            <button class="fas fa-angle-up" v-on:click="voteTarget(comment, 'comment', true, postSingle.active_version._id)"></button>
                            <small class="badge badge-pill badge-success">{{ comment.votePros }}</small>
                            <small class="badge badge-pill badge-danger">{{ comment.voteCons }}</small>
                            <button class="fas fa-angle-down" v-on:click="voteTarget(comment, 'comment', false, postSingle.active_version._id)"></button>
                        </td>
                        <td v-if="authUserData.id === comment.author_id">
                            <button class="btn btn-secondary btn-sm" title="Éditer mon commentaire" v-on:click="toggleCommentEditMode(comment._id, comment.content)">Edit</button>
                            <button class='btn btn-danger btn-sm' title="supprimer le commentaire" v-on:click="deleteComment(comment._id)">Suppr</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="col-12">
            <div class="input-group">
                <textarea-autosize class="form-control" aria-label="With textarea" v-model="commentToAdd"></textarea-autosize>
                <div class="input-group-append">
                    <button class="fas fa-plus" v-on:click="addComment"></button>
                </div>
            </div>
        </div>

    </div>
</div>
</template>

<script>
import {
    mapState
} from 'vuex'
import VueHighlightJS from 'vue-highlightjs'

export default {
    data: function() {
        return {
            name: 'PostSingleComponent',
            commentToAdd: '',
            userIsAuthorOfPost: false,
            userIsAuthorOfActiveVersion: false,
            postEditMode: false,
            postEditedTitle: "",
            postEditedKeywords: "",
            commentEditMode: false,
            commentEditedContent: "",
            editedCommentId: null
        }
    },
    computed: {
        ...mapState([
            'postSingle',
            'authUserData',
            'userLogged'
        ])
    },
    methods: {
        changeVersion: function(versionId) {

            let payload = {
                postId: this.postSingle._id,
                versionId: versionId
            };
            this.$store.dispatch('changePostVersionAction', payload)
                .then((response) => {
                    this.updateUserRights();
                }, (error) => {
                    console.error(error);
                });
        },

        addComment: function() {

            if (this.commentToAdd != '') {

                let comment = {
                    content: this.commentToAdd,
                }

                let payload = {
                    postId: this.postSingle._id,
                    versionId: this.postSingle.active_version._id,
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
            this.$router.push('/creer-une-version/' + this.postSingle._id);
        },

        updateUserRights: function() {
            this.userIsAuthorOfPost = (this.authUserData.id === this.postSingle.author_id) ? true : false;
            this.userIsAuthorOfActiveVersion = (this.authUserData.id === this.postSingle.active_version.author_id) ? true : false;
        },

        toggleEditMode: function() {
            this.postEditMode = true;
        },

        validatePostUpdate: function() {
            let arKeywords = this.postEditedKeywords.split(" ");
            let payload = {
                postId: this.postSingle._id,
                versionId: this.postSingle.active_version._id,
                requestData: {
                    title: this.postEditedTitle,
                    keywords: arKeywords
                }
            };
            this.$store.dispatch('updatePost', payload);
            this.postEditMode = false; //pas la peine ?
        },

        deletePost: function() {
            this.$store.dispatch('deletePost', this.postSingle._id)
                .then((response) => {
                    this.$router.push('/groupe/' + this.postSingle.group_id);
                }, (error) => {
                    console.error(error);
                });
        },

        editActiveVersion: function() {
            this.$router.push('/editer-une-version/' + this.postSingle._id + '/' + this.postSingle.active_version._id);
        },

        deleteActiveVersion: function() {
            this.$store.dispatch('deleteVersion', this.postSingle.active_version._id)
                .then((response) => {
                    this.$store.dispatch('initPostSingleAction', {
                        postId: this.postSingle._id
                    }); //reload post with updated versions list
                    this.$router.push('/article/' + this.postSingle._id);
                }, (error) => {
                    console.error(error);
                });
        },

        toggleCommentEditMode: function(commentId, commentContent) {
            this.commentEditMode = true;
            this.commentEditedContent = commentContent;
            this.editedCommentId = commentId;
        },

        validateCommentUpdate: function(commentId) {
            this.commentEditMode = false;
            let payload = {
                commentId: commentId,
                postId: this.postSingle._id,
                versionId: this.postSingle.active_version._id,
                requestData: {
                    content: this.commentEditedContent
                }
            };
            this.$store.dispatch('updateComment', payload)
                .then((response) => {
                    //console.log(response);
                }, (error) => {
                    console.log(error);
                });
        },

        deleteComment: function(commentId) {
            let payload = {
                postId: this.postSingle._id,
                versionId: this.postSingle.active_version._id,
                commentId: commentId
            };
            this.$store.dispatch('deleteComment', payload)
                .then((response) => {
                    //
                }, (error) => {
                    console.error(error);
                });
        },

        getNotifications: function() {
            this.$store.dispatch('getNotificationsAction');
            // console.log(this.$store.state.userNotifs);
            // console.log(this.userNotifs);
        },

        init: function(data) {
            if (data.versionId != null) {
                this.$store.dispatch('changePostVersionAction', data)
                .then((response)=>{
                  this.updateUserRights();
                  this.getNotifications();
                }, (error)=>{
                  console.error(error);
                });
            } else {
                this.$store.dispatch('initPostSingleAction', data)
                            .then( (response) => {
                              this.postEditedTitle = this.postSingle.title;
                              this.postEditedKeywords;
                              this.postSingle.keywords.forEach((word)=> {
                                this.postEditedKeywords += word + " ";
                              });
                              this.updateUserRights();
                              this.getNotifications();
                            }, (error) => {
                              console.error(error);
                            });
            }

        }
    },
    created: function() {

        let postId = this.$route.params.postId;
        let versionId = (this.$route.params.versionId) ? this.$route.params.versionId : null;

        let data = {
            versionId: versionId,
            postId: postId
        }

        if (this.userLogged) {
            this.init(data);
        } else {
            this.$store.dispatch('autoLogin')
                        .then((response)=>{
                            this.init(data);
                        }, (error)=>{
                            console.error(error);
                            this.$router.push("/login");
                        });
        }
    },
    watch: {
        '$route': function(to, from) {

            let postId = to.params.postId;
            // let postId = (to.params.postId) ? to.params.postId : null;
            let versionId = (to.params.versionId) ? to.params.versionId : null;

            let data = {
                versionId: versionId,
                postId: postId
            }

            this.init(data);
        }
    }
}
</script>

<style scoped>
.main-block {
    /* position: relative;
    right: 0;
    top: 8vh; */
}

</style>
