<template>
<div>
    <!-- <div v-if="postSingle == ''">
        <img src="@/assets/spinner.gif" alt="Chargement en cours">
    </div> -->

    <!-- post row -->
    <div class="row align-items-center justify-content-center p-0 m-0">
        <div class="col-sm-1 col-2 d-flex flex-column card-bg2 align-self-stretch p-0 m-0">
            <small class="cursor square-btn bg-info text-center pt-1 font-weight-bold" v-on:click="voteTarget(postSingle, 'post', true, postSingle.active_version._id)" title="Voter pour cet article">
                + {{ postSingle.votePros }}
            </small>
            <small class="cursor square-btn bg-secondary text-center pt-1 font-weight-bold" v-on:click="voteTarget(postSingle, 'post', false, postSingle.active_version._id)" title="Voter contre cet article">
                - {{ postSingle.voteCons }}
            </small>
        </div>
        <div class="col-sm-7 col-8 py-4 card-bg2 px-0 m-0">
            <div class="row justify-content-center">
                <div class="col-12">
                    <div v-if="postEditMode" class="row justify-content-center">
                        <textarea-autosize type="text" v-model="postEditedTitle" class="text-center"></textarea-autosize>
                    </div>
                    <h2 v-else class="text-center">{{ postSingle.title }}</h2>
                </div>
                <div class="col-12">
                    <p class="text-center align-self-middle card-text2">
                        Groupe:
                        <router-link :to="{ name: 'groupPostsList', params: { groupId: postSingle.group_id } }">{{ postSingle.group_name }}</router-link>
                    </p>
                </div>
                <div class="col-12">
                    <p class="footer-text card-text2">
                        Créé le {{ postSingle.created_at }} par
                        <router-link v-if="authUserData.id == postSingle.author_id" to="/profil">
                                {{postSingle.author_name}}
                        </router-link>
                        <router-link
                                v-else
                                :to="{ name: 'userPublicProfile', params: {userId: postSingle.author_id, userName: postSingle.author_name.replace(' ', '-')} }">
                                {{postSingle.author_name}}
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
        <div class="col-sm-1 col-2 card-bg2 align-self-stretch d-flex flex-column align-items-end p-0 m-0">
            <small v-if="userIsFollowing" title="Ne plus suivre cet article" v-on:click="unfollow" class="cursor square-btn bg-info text-center pt-1">
                <i class="fas fa-bookmark"></i>
            </small>
            <small v-if="!userIsFollowing" title="Suivre cet article" v-on:click="follow" class="cursor square-btn bg-secondary text-center pt-1">
                <i class="far fa-bookmark"></i>
            </small>
            <template v-if="userIsAuthorOfPost">
                <small v-if="!postEditMode" class="cursor square-btn bg-primary text-center pt-1" title="Éditer cet article" v-on:click="toggleEditMode">
                    <i class="fas fa-pen"></i>
                </small>
                <small v-else-if="postEditMode" class="cursor square-btn bg-success text-center pt-1" v-on:click="validatePostUpdate" title="Valider les changements">
                    <i class="fas fa-check"></i>
                </small>
                <small class="cursor square-btn bg-danger text-center pt-1" title="Supprimer cet article" v-on:click="deletePost">
                    <i class="fas fa-trash-alt"></i>
                </small>
            </template>
        </div>
        <div class="col-sm-3 col-12 card-bg1 align-self-stretch p-0 m-0">
            <!-- <p><strong class="text-center card-text1 py-4">
                Mots-clés
            </strong></p> -->
            <div v-if="postEditMode" class="row align-items-stretch justify-content-center py-4">
                <textarea-autosize type="text" v-model="postEditedKeywords"></textarea-autosize>
            </div>
            <div v-else class="d-flex flex-wrap p-4">
                <p class="font-weight-light font-italic border-0 bg-transparent card-text1 pr-1" v-for="word in this.postSingle.keywords">{{word}}</p>
            </div>
        </div>
    </div>

    <!-- version row -->
    <div class="row align-items-center justify-content-center p-0 m-0">
        <div class="col-sm-1 col-2 d-flex flex-column card-bg1 align-self-stretch p-0 m-0">
            <small class="cursor square-btn bg-info text-center pt-1 font-weight-bold" v-on:click="voteTarget(postSingle.active_version, 'version', true, postSingle.active_version._id)">+ {{ postSingle.active_version.votePros }}</small>

            <small class="cursor square-btn bg-secondary text-center pt-1 font-weight-bold" v-on:click="voteTarget(postSingle.active_version, 'version', false, postSingle.active_version._id)">- {{ postSingle.active_version.voteCons }}</small>
        </div>
        <div class="col-sm-7 col-8 py-3 card-bg1">
            <div class="row justify-content-center">
                <div class="col-12">
                    <h4 class="text-center">
                        Version: <strong>{{ postSingle.active_version.number }}</strong>
                    </h4>
                </div>
                <div class="col-12">
                    <p class="footer-text card-text2">
                        Créé le {{ postSingle.active_version.created_at }} par
                        <router-link v-if="authUserData.id == postSingle.active_version.author_id" to="/profil">
                                {{postSingle.author_name}}
                        </router-link>
                        <router-link
                                v-else
                                :to="{ name: 'userPublicProfile', params: {userId: postSingle.active_version.author_id, userName: postSingle.active_version.author_name.replace(' ', '-')} }">
                                {{postSingle.active_version.author_name}}
                        </router-link>
                    </p>
                </div>
                <!-- chevron sous la version??? -->
                <!-- <div class="col-12">
                    <p class="logo-small bg-info text-center pt-1 font-weight-bold" v-on:click="voteTarget(postSingle.active_version, 'version', true, postSingle.active_version._id)">
                        <i class="fas fa-chevron-down text-dark"></i>
                    </p>
                </div> -->
            </div>
        </div>
        <div class="col-sm-1 col-2 card-bg1 align-self-stretch d-flex flex-column align-items-end p-0">
            <template v-if="userIsAuthorOfActiveVersion">
                <small class="cursor square-btn bg-primary text-center pt-1" title="Éditer cette version" v-on:click="editActiveVersion">
                    <i class="fas fa-pen"></i>
                </small>
                <small class="cursor square-btn bg-danger text-center pt-1" title="supprimer cette version" v-on:click="deleteActiveVersion" v-if="postSingle.active_version.number != '1.0'">
                    <i class="fas fa-trash-alt"></i>
                </small>
            </template>
        </div>
        <div class="col-sm-3 col-12 card-bg2 d-flex flex-wrap align-self-stretch align-items-start justify-content-start p-0 m-0">
            <template v-for="version in postSingle.versions">
                <!-- <small v-if="postSingle.active_version._id == version._id" class="square-btn bg-success text-center pt-1 font-weight-bold">
                    {{ version.number }}
                </small>
                <small v-else v-on:click="changeVersion(version._id)" class="cursor square-btn bg-secondary text-center pt-1 font-weight-bold">
                    {{ version.number }}
                </small> -->
                <router-link class="square-btn bg-success text-center pt-1 font-weight-bold" :to="{ name: 'notificatedPost', params: {postId: postSingle._id, versionId: version._id} }"
                            v-if="postSingle.active_version._id == version._id">
                    <small  >
                        {{ version.number }}
                    </small>
                </router-link>
                <router-link class="cursor square-btn bg-secondary text-center pt-1 font-weight-bold" v-else :to="{ name: 'notificatedPost', params: {postId: postSingle._id, versionId: version._id} }">
                    <small >
                        {{ version.number }}
                    </small>
                </router-link>
            </template>
            <small class="cursor square-btn bg-primary text-center pt-1" v-on:click="createVersion" title="Ajouter une version">
                <i class="fas fa-plus"></i>
            </small>
        </div>
    </div>

    <!-- version content & snippets row -->
    <div class="row justify-content-center align-items-center p-0 m-0">
        <div class="col-sm-9 col-12 card-bg2 py-4 m-0">
            <p v-html="'<pre>'+postSingle.active_version.text_content +'</pre>'" class="card-text2"></p>
        </div>
        <div class="col-sm-3 col-12 card-bg1 align-self-stretch p-0 m-0">
        </div>
        <!-- alterner bgcolor? -->
        <div v-for="(snippet, key, index) in postSingle.active_version.code_snippets" class="col-12 px-5 pb-4 pt-5 align-self-center" :class="bg2(key)">
            <pre v-highlightjs="snippet.content"><code></code></pre>
        </div>
    </div>

    <!-- comments row -->
    <div class="row justify-content-center align-items-center px-0 pb-4 m-0">
        <div class="col-sm-9 col-12 card-bg2 m-0 p-0">
            <div class="input-group">
                <textarea-autosize class="form-control rounded-0 d-block" placeholder=" Taper votre commentaire" aria-label="With textarea" v-model="commentToAdd" @keydown.enter.exact.prevent @keyup.enter.exact.native="addComment" @keydown.enter.shift.exact="newline(commentToAdd)"></textarea-autosize>
                <div class="input-group-append">
                    <button type="button" class="cursor btn-primary rounded-0 border-0" v-on:click="addComment">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="col-sm-3 col-0 card-bg1">

        </div>
    </div>
    <div v-for="(comment, key, index) in postSingle.active_version.comments" class="row justify-content-start align-items-center p-0 m-0">
        <div class="col-sm-2 col-2 d-flex align-self-stretch p-0 m-0" :class="bg2(key)">
            <div class="d-flex flex-column">
                <small class="cursor square-btn bg-info text-center pt-1 font-weight-bold" v-on:click="voteTarget(comment, 'comment', true, postSingle.active_version._id)">
                    + {{ comment.votePros }}
                </small>
                <small class="cursor square-btn bg-secondary text-center pt-1 font-weight-bold" v-on:click="voteTarget(comment, 'comment', false, postSingle.active_version._id)">
                    - {{ comment.voteCons }}
                </small>
            </div>
            <!-- if large viewport -->
            <router-link v-if="authUserData.id == comment.author_id" to="/profil">
                <img class="logo-small" :src="comment.author_profile_pic_url">
            </router-link>
            <router-link v-else :to="{ name: 'userPublicProfile', params: {userId: comment.author_id, userName: comment.author_name.replace(' ', '-')} }">
                <img class="logo-small" :src="comment.author_profile_pic_url">
            </router-link>

        </div>
        <div class="col-sm-6 col-9 p-0 m-0" :class="bg2(key)">
            <div class="col-12">
                <p v-if="authUserData.id == comment.author_id" :class="textColor2(key)">
                    <strong>
                        <router-link to="/profil">{{ comment.author_name }}</router-link>
                    </strong>
                     - <small :class="textColor2(key)">{{ comment.created_at }}</small>
                </p>
                <p v-else :class="textColor2(key)">
                    <strong>
                        <router-link
                                :to="{ name: 'userPublicProfile', params: {userId: comment.author_id, userName: comment.author_name.replace(' ', '-')} }">
                                {{ comment.author_name }}
                        </router-link>
                    </strong>
                     - <small :class="textColor2(key)">{{ comment.created_at }}</small>
                </p>
            </div>
            <div class="col-12">
                <p v-if="comment._id != editedCommentId || !commentEditMode" class="" v-html="'<pre>'+comment.content+'</pre>'" :class="textColor2(key)"></p>
                <textarea-autosize v-if="commentEditMode && comment._id==editedCommentId" v-model="commentEditedContent"></textarea-autosize>
            </div>
        </div>
        <div class="col-sm-1 col-1 d-flex flex-column align-self-stretch align-items-end p-0 m-0" :class="bg2(key)">
            <template v-if="authUserData.id === comment.author_id">
                <small v-if="!commentEditMode" class="cursor square-btn bg-primary text-center pt-1" title="Éditer mon commentaire" v-on:click="toggleCommentEditMode(comment._id, comment.content)">
                    <i class="fas fa-pen"></i>
                </small>
                <small v-else-if="commentEditMode && comment._id === editedCommentId" class="cursor square-btn bg-success text-center pt-1" v-on:click="validateCommentUpdate(comment._id)" title="Valider les changements?">
                    <i class="fas fa-check"></i>
                </small>
                <small class='cursor square-btn bg-danger text-center pt-1' title="Supprimer mon commentaire" v-on:click="deleteComment(comment._id)">
                    <i class="fas fa-trash-alt"></i>
                </small>
            </template>
        </div>
        <div class="col-sm-3 col-0 align-self-stretch" :class="bg1(key)">

        </div>
    </div>
    <div class="row justify-content-center p-0 m-0">
        <div class="col-sm-9 col-12 card-bg1 m-0 p-0">
            <div class="d-flex align-items-center justify-content-center">
                <small v-if="!firstPageOfComments" class="cursor square-btn bg-info text-center pt-1 font-weight-bold" v-on:click="getCommentsPrevPage" title="Commentaires précédents">
                    <i class="fas fa-chevron-left"></i>
                </small>
                <small v-else class="square-btn bg-secondary text-center pt-1 font-weight-bold">
                    <i class="fas fa-chevron-left"></i>
                </small>
                <small v-if="!lastPageOfComments" class="cursor square-btn bg-info text-center pt-1 font-weight-bold" v-on:click="getCommentsNextPage" title="Commentaires suivants">
                    <i class="fas fa-chevron-right"></i>
                </small>
                <small v-else class="square-btn bg-secondary text-center pt-1 font-weight-bold">
                    <i class="fas fa-chevron-right"></i>
                </small>
            </div>
        </div>
        <div class="col-sm-3 col-0 align-self-stretch m-0 p-0 card-bg2">

        </div>
    </div>
</div>
</template>

<script>
import {
    mapState
} from 'vuex'
import 'highlight.js/styles/an-old-hope.css'
// import 'highlight.js/styles/purebasic.css'
import VueHighlightJS from 'vue-highlightjs'
const axios = require('axios');
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
        ]),
        lastPageOfComments() {
            return (this.lastCommentListId == this.postSingle.active_version.last_comment_id) ? true : false;
        },

        firstPageOfComments() {
            return (this.firstCommentListId == this.postSingle.active_version.first_comment_id) ? true : false;
        },
        lastCommentListId() {
            if (this.postSingle.active_version.comments.length > 0) {
                return this.postSingle.active_version.comments[this.postSingle.active_version.comments.length - 1]._id;
            } else return null;
        },
        firstCommentListId() {
            if (this.postSingle.active_version.comments.length > 0) {
                return this.postSingle.active_version.comments[0]._id;
            } else return null;
        }
    },
    methods: {
        bg1: function(key) {
            if (key % 2 == 0) {
                return 'card-bg1';
            } else return 'card-bg2';
        },
        bg2: function(key) {
            if (key % 2 == 0) {
                return 'card-bg2';
            } else return 'card-bg1';
        },
        textColor1: function(key) {
            if (key % 2 == 0) {
                return 'card-text2';
            } else return 'card-text1';
        },
        textColor2: function(key) {
            if (key % 2 == 0) {
                return 'card-text1';
            } else return 'card-text2';
        },
        newline: function(object) {
            object = `${this.commentToAdd}\n`;
        },
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

        addComment: function() {

            if (this.commentToAdd != '' && this.commentToAdd != '\n') {
                let comment = {
                    content: this.commentToAdd,
                }

                let payload = {
                    postId: this.postSingle._id,
                    versionId: this.postSingle.active_version._id,
                    comment: comment
                }

                this.$store.dispatch('addCommentAction', payload)
                            .then((response)=>{
                                //
                            }, (error)=>{
                                console.error(error);
                            });

                this.commentToAdd = '';
            }
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

        getNotifications: function() {
            this.$store.dispatch('getNotificationsAction');
        },


        getCommentsNextPage: function() {

            let payload = {
                postId: this.postSingle._id,
                versionId: this.postSingle.active_version._id,
                commentId: this.lastCommentListId
            };

            this.$store.dispatch('getCommentsNextPageAction', payload)
                        .then((response)=>{
                            //
                        }, (error)=>{
                            console.error(error);
                        });
        },

        getCommentsPrevPage: function() {

            let payload = {
                postId: this.postSingle._id,
                versionId: this.postSingle.active_version._id,
                commentId: this.firstCommentListId
            };

            this.$store.dispatch('getCommentsPrevPageAction', payload)
                        .then((response)=>{
                            //
                        }, (error)=>{
                            console.error(error);
                        });
        },

        init: function(data) {

            if (data.versionId != null && data.commentId == null) {
                this.$store.dispatch('changePostVersionAction', data)
                    .then((response) => {
                        this.updateUserRights();
                        this.getNotifications();
                        this.isUserFollowing();
                        //
                    }, (error) => {
                        console.error(error);
                    });
            } else if (data.commentId != null) {
                console.log("comment page");
                this.$store.dispatch('changeCommentPageAction', data)
                    .then((response) => {
                        this.updateUserRights();
                        this.getNotifications();
                        this.isUserFollowing();
                        //
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
                        //
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
            let versionId = (to.params.versionId) ? to.params.versionId : null;
            let commentId = (to.params.commentId) ? to.params.commentId : null;

            let data = {
                versionId: versionId,
                postId: postId,
                commentId: commentId
            }

            this.init(data);
        }
    }
}
</script>

<style scoped>
.card-bg2 {
    /* background-color: #8baed3; */
    background-color: #c3d1dd;
}

.card-bg1 {
    background-color: #fff;
}

.card-text2 {
    color: #57515b;
}

.card-text1 {
    color: #57515b;
}
</style>
