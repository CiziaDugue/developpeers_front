<template>
<div>
    <!-- <div v-if="postSingle == ''">
        <img src="@/assets/spinner.gif" alt="Chargement en cours">
    </div> -->

    <div class="row justify-content-center align-items-center p-2">
        <div class="col-1 align-self-start">
            <small class="cursor badge badge-secondary rounded-0" v-on:click="goBack()">
                <i class="fas fa-angle-left"></i>
            </small>
            <small class="cursor badge badge-success rounded-0" v-on:click="voteTarget(postSingle, 'post', true, postSingle.active_version._id)">+ {{ postSingle.votePros }}</small>
            <small class="cursor badge badge-warning rounded-0" v-on:click="voteTarget(postSingle, 'post', false, postSingle.active_version._id)">- {{ postSingle.voteCons }}</small>
        </div>
        <div class="col-8">
            <div class="row">
                <div class="col-12">
                    <h2 class="text-center">{{ postSingle.title }}</h2>
                    <div v-if="postEditMode">
                        <label>Modifier le titre : </label>
                        <input type="text" v-model="postEditedTitle">
                    </div>
                </div>
                <div class="col-12">
                    <p class="text-center">Auteur: {{ postSingle.author_name }} - Groupe: <router-link :to="{ name: 'groupPostsList', params: { groupId: postSingle.group_id } }">{{ postSingle.group_name }}</router-link>
                    </p>
                </div>
                <div class="col-12">
                    <p class="text-center">Créé le {{ postSingle.created_at }}</p>
                </div>
            </div>
        </div>
        <div class="col-2">
            <ul class="card-text list-group list-group-flush">
                <li class="list-group-item font-weight-light font-italic border-0" v-for="word in this.postSingle.keywords">{{word}}</li>
            </ul>
            <div v-if="postEditMode">
                <label>Modifier les mots-clés : </label>
                <input type="text" v-model="postEditedKeywords">
            </div>
        </div>
        <div class="col-1 align-self-start">
            <button v-if="!userIsFollowing" type="button" title="Suivre cet article" v-on:click="follow" class="btn btn-outline-secondary rounded-0">
                <i class="fa fa-eye"></i>
            </button>

            <button v-if="userIsFollowing" type="button" title="Ne plus suivre cet article" v-on:click="unfollow" class="btn btn-outline-secondary rounded-0">
                <i class="far fa-eye-slash"></i>
            </button>
            <template v-if="userIsAuthorOfPost">
                <button v-if="!postEditMode" class="btn btn-secondary btn-sm rounded-0" title="Éditer cet article" v-on:click="toggleEditMode">
                    <i class="fas fa-pen"></i>
                </button>
                <button v-else-if="postEditMode" class="btn btn-sm btn-success rounded-0" v-on:click="validatePostUpdate" title="Valider les changements">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-danger btn-sm rounded-0" title="Supprimer cet article" v-on:click="deletePost">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </template>
        </div>
    </div>
    <div class="row justify-content-center align-items-center p-2">
        <div class="col-1 align-self-start">
            <small class="cursor badge badge-success rounded-0" v-on:click="voteTarget(postSingle.active_version, 'version', true, postSingle.active_version._id)">+ {{ postSingle.active_version.votePros }}</small>
            <small class="cursor badge badge-warning rounded-0" v-on:click="voteTarget(postSingle.active_version, 'version', false, postSingle.active_version._id)">- {{ postSingle.active_version.voteCons }}</small>
        </div>
        <div class="col-8">
            <div class="row">
                <div class="col-12">
                    <p class="text-center">
                        Version: {{ postSingle.active_version.number }} - Auteur: {{postSingle.active_version.author_name}}
                    </p>
                    <template v-if="userIsAuthorOfActiveVersion">
                        <button class="btn btn-secondary btn-sm rounded-0" title="Éditer cette version" v-on:click="editActiveVersion">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="btn btn-danger btn-sm rounded-0" title="supprimer cette version" v-on:click="deleteActiveVersion" v-if="postSingle.active_version.number != '1.0'">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </template>
                </div>
                <div class="col-12">
                    <p class="text-center">Créé le {{ postSingle.created_at }}</p>
                </div>
            </div>
        </div>
        <div class="col-3 align-self-start">
            <div class="row justify-content-end">
                <template v-for="version in postSingle.versions">
                    <button v-if="postSingle.active_version._id == version._id" class="btn btn-outline-primary rounded-0" disabled>
                        {{ version.number }}
                    </button>
                    <button v-else v-on:click="changeVersion(version._id)" class="btn btn-outline-secondary rounded-0">
                        {{ version.number }}
                    </button>
                </template>
                <button class="btn btn-outline-secondary rounded-0" v-on:click="createVersion">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        </div>
    </div>
    <div class="row justify-content-center align-items-center p-2">
        <div class="col-12">
            <p class="text-center">{{ postSingle.active_version.text_content }}</p>
            <!-- <p v-html="'<pre>'+postSingle.active_version.text_content +'</pre>'"></p> -->
        </div>
        <div v-for="snippet in postSingle.active_version.code_snippets" class="col-12">
            <pre v-highlightjs="snippet.content"><code></code></pre>
        </div>
    </div>
    <div class="row justify-content-center align-items-center p-2">
        <div class="col-12" v-for="comment in postSingle.active_version.comments">
            <div class="row">
                <div class="col-1">
                    <div class="row">
                        <div class="col-12">
                            <p>{{ comment.author_name }}</p>
                        </div>
                        <div class="col-12">
                            <small>{{ comment.created_at }}</small>
                        </div>
                    </div>
                </div>
                <div class="col-8">
                    <p v-if="comment._id != editedCommentId || !commentEditMode" class="" v-html="'<pre>'+comment.content+'</pre>'"></p>
                    <!-- <template v-if="commentEditMode && comment._id==editedCommentId"> -->
                        <textarea-autosize v-if="commentEditMode && comment._id==editedCommentId" v-model="commentEditedContent"></textarea-autosize>
                        <!-- <button type="button" class="btn btn-sm btn-success rounded-0" v-on:click="validateCommentUpdate(comment._id)">
                            <i class="fas fa-check"></i>
                        </button> -->
                    <!-- </template> -->
                </div>
                <div class="col-2">
                    <small class="cursor badge badge-success rounded-0" v-on:click="voteTarget(comment, 'comment', true, postSingle.active_version._id)">+ {{ comment.votePros }}</small>
                    <small class="cursor badge badge-warning rounded-0" v-on:click="voteTarget(comment, 'comment', false, postSingle.active_version._id)">- {{ comment.voteCons }}</small>
                </div>
                <div class="col-1">
                    <template v-if="authUserData.id === comment.author_id">
                        <button v-if="!commentEditMode" class="btn btn-secondary btn-sm rounded-0" title="Éditer mon commentaire" v-on:click="toggleCommentEditMode(comment._id, comment.content)">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button v-else-if="commentEditMode && comment._id==editedCommentId" type="button" class="btn btn-sm btn-success rounded-0" v-on:click="validateCommentUpdate(comment._id)">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class='btn btn-danger btn-sm rounded-0' title="Supprimer mon commentaire" v-on:click="deleteComment(comment._id)">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </template>
                </div>
            </div>
        </div>
        <div class="col-12">
            <div class="input-group input-group-sm">
                <textarea-autosize class="form-control rounded-0" aria-label="With textarea" placeholder="Taper votre commentaire" v-model="commentToAdd"></textarea-autosize>
                <div class="input-group-append">
                    <button type="button" class=" btn-outline-primary my-2 my-sm-0 rounded-0" v-on:click="addComment">
                        <i class="fas fa-plus"></i>
                    </button>
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
            editedCommentId: null,
            userIsFollowing: false
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
        isUserFollowing: function() {
            this.userIsFollowing = (this.postSingle.followers.indexOf(this.authUserData.id) != -1) ? true : false;
        },

        follow: function() {
            let payload = {
                postId: this.postSingle._id,
                fromPostSingle: true
            };

            this.$store.dispatch('followPostAction', payload)
                .then((response) => {
                    console.log(response.data);
                    let postId = this.postSingle._id;
                    let versionId = this.postSingle.active_version._id;

                    let data = {
                        versionId: versionId,
                        postId: postId
                    }
                    this.init(data);

                }, (error) => {
                    console.error(error);
                });
        },

        unfollow: function() {
            let payload = {
                postId: this.postSingle._id,
                fromPostSingle: true
            };

            this.$store.dispatch('unfollowPostAction', payload)
                .then((response) => {
                    console.log(response.data);
                    let postId = this.postSingle._id;
                    let versionId = this.postSingle.active_version._id;

                    let data = {
                        versionId: versionId,
                        postId: postId
                    }
                    this.init(data);

                }, (error) => {
                    console.error(error);
                });
        },

        changeVersion: function(versionId) {

            let payload = {
                postId: this.postSingle._id,
                versionId: versionId
            };
            this.$store.dispatch('changePostVersionAction', payload)
                .then((response) => {
                    this.updateUserRights();
                    this.isUserFollowing();
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
                    .then((response) => {
                        this.updateUserRights();
                        this.getNotifications();
                        this.isUserFollowing();
                    }, (error) => {
                        console.error(error);
                    });
            } else {
                this.$store.dispatch('initPostSingleAction', data)
                    .then((response) => {
                        this.postEditedTitle = this.postSingle.title;
                        this.postEditedKeywords;
                        this.postSingle.keywords.forEach((word) => {
                            this.postEditedKeywords += word + " ";
                        });
                        //remove final white space
                        this.postEditedKeywords = this.postEditedKeywords.substring(0, this.postEditedKeywords.length - 1);
                        this.updateUserRights();
                        this.getNotifications();
                        this.isUserFollowing();
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
                .then((response) => {
                    this.init(data);
                }, (error) => {
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

.cursor:hover {
    cursor: pointer;
    transform: scale(1.1);
}
</style>
