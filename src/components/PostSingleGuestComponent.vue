<template>
<div class="main-block">

    <!-- <div v-if="postSingle == ''" class="container">
        <img src="@/assets/spinner.gif" alt="Chargement en cours">
    </div> -->
    <!-- post row -->
    <div class="row align-items-center justify-content-center m-0 p-0">
        <div class="col-sm-1 col-2 d-flex flex-column card-bg2 align-self-stretch m-0 p-0">
            <span class="cursor square-btn bg-white text-center pt-1" v-on:click="goBack()">
                <i class="fas fa-angle-left"></i>
            </span>
            <small class="square-btn bg-info text-center pt-1 font-weight-bold" title="Votes pour cet article">
                + {{ postSingle.votePros }}
            </small>
            <small class="square-btn bg-secondary text-center pt-1 font-weight-bold" title="Votes contre cet article">
                - {{ postSingle.voteCons }}
            </small>
        </div>
        <div class="col-sm-8 col-10 py-4 card-bg2 m-0 px-0">
            <div class="row justify-content-center">
                <div class="col-12">
                    <h2 class="text-center">{{ postSingle.title }}</h2>
                </div>
                <div class="col-12">
                    <p class="text-center align-self-middle card-text2">
                        Groupe:
                        <router-link to="/login">{{ postSingle.group_name }}</router-link>
                    </p>
                </div>
                <div class="col-12">
                    <p class="footer-text card-text2">
                        Créé le {{ postSingle.created_at }} par
                        <router-link
                                :to="{ name: 'userPublicProfile', params: {userId: postSingle.author_id, userName: postSingle.author_name.replace(' ', '-')} }">
                                {{postSingle.author_name}}
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
        <div class="col-sm-3 col-12 card-bg1 align-self-stretch m-0 p-0">
            <div class="d-flex flex-wrap p-4">
                <p class="font-weight-light font-italic border-0 bg-transparent card-text1 pr-1" v-for="word in this.postSingle.keywords">{{word}}</p>
            </div>
        </div>
    </div>

    <!-- version row -->
    <div class="row align-items-center justify-content-center m-0 p-0">
        <div class="col-sm-1 col-2 d-flex flex-column card-bg1 align-self-stretch m-0 p-0">
            <small class="square-btn bg-info text-center pt-1 font-weight-bold">
                + {{ postSingle.active_version.votePros }}
            </small>

            <small class="square-btn bg-secondary text-center pt-1 font-weight-bold">
                - {{ postSingle.active_version.voteCons }}
            </small>
        </div>
        <div class="col-sm-8 col-10 py-3 card-bg1 m-0 px-0">
            <div class="row justify-content-center">
                <div class="col-12">
                    <h4 class="text-center">
                        Version: <strong>{{ postSingle.active_version.number }}</strong>
                    </h4>
                </div>
                <div class="col-12">
                    <p class="footer-text card-text1">
                        Créé le {{ postSingle.active_version.created_at }} par
                        <router-link
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

        <div class="col-sm-3 col-12 card-bg2 d-flex flex-wrap align-self-stretch align-items-start justify-content-start p-0 m-0">
            <template v-for="version in postSingle.versions">
                <small v-if="postSingle.active_version._id == version._id" class="square-btn bg-success text-center pt-1 font-weight-bold">
                    {{ version.number }}
                </small>
                <small v-else v-on:click="changeVersion(version._id)" class="cursor square-btn bg-secondary text-center pt-1 font-weight-bold">
                    {{ version.number }}
                </small>
            </template>
        </div>
    </div>

    <!-- version content & snippets row -->
    <div class="row justify-content-center align-items-center m-0 p-0">
        <div class="col-sm-9 col-12 card-bg2 p-4">
            <p v-html="'<pre>'+postSingle.active_version.text_content +'</pre>'" class="card-text2"></p>
        </div>
        <div class="col-sm-3 col-12 card-bg1 align-self-stretch">
        </div>
        <!-- alterner bgcolor? -->
        <div v-for="(snippet, key, index) in postSingle.active_version.code_snippets" class="col-12 px-5 pb-4 pt-5 align-self-center" :class="bg2(key)">
            <pre v-highlightjs="snippet.content"><code></code></pre>
        </div>
    </div>

    <!-- comments row -->
    <div v-for="(comment, key, index) in postSingle.active_version.comments" class="row justify-content-start align-items-center m-0 p-0">
        <div class="col-sm-2 col-2 d-flex align-self-stretch m-0 p-0" :class="bg2(key)">
            <div class="d-flex flex-column">
                <small class="square-btn bg-info text-center pt-1 font-weight-bold">
                    + {{ comment.votePros }}
                </small>
                <small class="square-btn bg-secondary text-center pt-1 font-weight-bold">
                    - {{ comment.voteCons }}
                </small>
            </div>
            <router-link :to="{ name: 'userPublicProfile', params: {userId: postSingle.author_id, userName: postSingle.author_name.replace(' ', '-')} }">
                <img class="logo-small" :src="comment.author_profile_pic_url">
            </router-link>

        </div>
        <div class="col-sm-7 col-10 m-0 p-0" :class="bg2(key)">
            <div class="col-12">
                <p :class="textColor2(key)">
                    <strong>
                        <router-link :to="{ name: 'userPublicProfile', params: {userId: postSingle.author_id, userName: postSingle.author_name.replace(' ', '-')} }">
                            {{ comment.author_name }}
                        </router-link>
                    </strong>
                    - <small :class="textColor2(key)">{{ comment.created_at }}</small>
                </p>
            </div>
            <div class="col-12">
                <p class="" v-html="'<pre>'+comment.content+'</pre>'" :class="textColor2(key)"></p>
            </div>
        </div>
        <div class="col-sm-3 col-0 align-self-stretch m-0 p-0" :class="bg1(key)">

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
import VueHighlightJS from 'vue-highlightjs'

export default {
    data: function() {
        return {
            name: 'PostSingleGuestComponent',
        }
    },
    computed: {
        ...mapState([
            'postSingle',
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
        changeVersion: function(version_id) {

            let payload = {
                post_id: this.postSingle._id,
                version_id: version_id
            };
            this.$store.dispatch('changeGuestPostVersionAction', payload)
                .then((response) => {
                    //
                }, (error) => {
                    console.error(error);
                });
        },

        goBack: function() {
            this.$router.go(-1);
        },
        getCommentsNextPage: function() {

            let payload = {
                postId: this.postSingle._id,
                versionId: this.postSingle.active_version._id,
                commentId: this.lastCommentListId
            };

            this.$store.dispatch('getGuestCommentsNextPageAction', payload)
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

            this.$store.dispatch('getGuestCommentsPrevPageAction', payload)
                        .then((response)=>{
                            //
                        }, (error)=>{
                            console.error(error);
                        });
        }
    },

    created: function() {
        if (!this.userLogged) {
            this.$store.dispatch('initGuestPostSingleAction', {
                    postId: this.$route.params.postId
                })
                .then((response) => {
                    this.postEditedTitle = this.postSingle.title;
                    this.postEditedKeywords;
                    this.postSingle.keywords.forEach((word) => {
                        this.postEditedKeywords += word + " ";
                    });

                }, (error) => {
                    console.error(error);
                });
        } else {
            this.$router.push('/article/' + this.postSingle._id);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
