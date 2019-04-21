<template>
<div class="container main-block">

    <!-- <div v-if="postSingle == ''" class="container">
        <img src="@/assets/spinner.gif" alt="Chargement en cours">
    </div> -->
    <!-- post row -->
    <div class="row align-items-center justify-content-center">
        <div class="col-sm-1 col-2 d-flex flex-column card-bg2 align-self-stretch">
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
        <div class="col-sm-8 col-10 py-5 card-bg2">
            <div class="row justify-content-center">
                <div class="col-12">
                    <h2 class="text-center">{{ postSingle.title }}</h2>
                </div>
                <div class="col-12 d-flex justify-content-around align-items-center">
                    <p class="text-center align-self-middle card-text2">
                        Groupe:
                        <router-link :to="{ name: 'groupPostsList', params: { groupId: postSingle.group_id } }">{{ postSingle.group_name }}</router-link>
                    </p>
                    <p class="text-center card-text2">
                        Auteur:
                        <router-link
                                :to="{ name: 'userPublicProfile', params: {userId: postSingle.author_id, userName: postSingle.author_name.replace(' ', '-')} }">
                                {{ postSingle.author_name }}
                        </router-link>
                        <img class="logo-small" :src="postSingle.author_profile_pic_url">
                    </p>
                </div>
                <div class="col-12">
                    <p class="footer-text card-text2">Créé le {{ postSingle.created_at }}</p>
                </div>
            </div>
        </div>
        <div class="col-sm-3 col-12 card-bg1 align-self-stretch">
            <ul class="list-group list-group-flush py-4">
                <li class="list-group-item font-weight-light font-italic border-0 bg-transparent" v-for="word in this.postSingle.keywords">{{word}}</li>
            </ul>
        </div>
    </div>

    <!-- old guestfeed -->
    <div class="row justify-content-center align-items-center">
        <div class="col-10">
            <div class="row border">
                <div class="col-md-6 col-12">
                    <button class="fas fa-angle-left" v-on:click="goBack()"></button>

                    <h2 class="text-center">{{ postSingle.title }}</h2>

                    <div>
                        <span>Mot clés :</span>
                        <ul>
                            <li v-for="word in this.postSingle.keywords">{{word}}</li>
                        </ul>
                    </div>

                </div>
                <div class="col-md-6 col-12">
                    <small class="badge badge-pill badge-success">{{ postSingle.votePros }}</small>
                    <small class="badge badge-pill badge-danger">{{ postSingle.voteCons }}</small>
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

                </div>
                <div class="col-md-6 col-12">
                    <small class="badge badge-pill badge-success">{{ postSingle.active_version.votePros }}</small>
                    <small class="badge badge-pill badge-danger">{{ postSingle.active_version.voteCons }}</small>
                </div>
            </div>
            <div class="row border">
                <div class="col-12">
                    <p>{{ postSingle.active_version.text_content }}</p>
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
                            <small class="badge badge-pill badge-success">{{ comment.votePros }}</small>
                            <small class="badge badge-pill badge-danger">{{ comment.voteCons }}</small>
                        </td>
                    </tr>
                </tbody>
            </table>
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
        ])
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
#main-block {
    width: 100%;
}
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
