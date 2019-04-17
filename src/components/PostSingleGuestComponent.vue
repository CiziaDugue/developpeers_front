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
                    <p class="text-center">{{ postSingle.active_version.text_content }}</p>
                    <p v-for="snippet in postSingle.active_version.code_snippets" class="border">
                        {{ snippet.content }}
                    </p>
                </div>
            </div>
        </div>
        <div class="col-2 border">

            <div class="row">
                <div class="col-12">
                    <button v-for="version in postSingle.versions" v-on:click="changeVersion(version._id)" class="btn btn-outline-secondary">
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
import {mapState} from 'vuex'

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
        changeVersion: function(version_id) {

            let payload = {
                post_id: this.postSingle._id,
                version_id: version_id
            };
            this.$store.dispatch('changeGuestPostVersionAction', payload)
            .then((response)=>{
              //
            }, (error)=>{
              console.error(error);
            });
        },

        goBack: function() {
            this.$router.go(-1);
        }
    },

    created: function() {
        if(!this.userLogged) {
            this.$store.dispatch('initGuestPostSingleAction', {
                postId: this.$route.params.postId
            })
            .then((response) => {
              this.postEditedTitle = this.postSingle.title;
              this.postEditedKeywords;
              this.postSingle.keywords.forEach((word)=> {
                this.postEditedKeywords += word + " ";
              });

            }, (error) => {
              console.error(error);
            });
        } else {
            this.$router.push('/article/'+this.postSingle._id);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-block {
    /* position: relative;
    right: 0;
    top: 8vh; */
}
</style>
