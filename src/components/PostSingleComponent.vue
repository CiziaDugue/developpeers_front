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
                    <div v-if="userIsAuthorOfPost">
                      <button  class="btn btn-secondary btn-sm" title="Éditer cet article" v-on:click="editPost">Edit</button>
                      <button  class="btn btn-danger btn-sm" title="Supprimer cet article" v-on:click="deletePost">Suppr</button>
                    </div>

                </div>
                <div class="col-md-6 col-12">
                    <button class="fas fa-angle-up" v-on:click="voteTarget(postSingle, 'post', true)"></button>
                    <small class="badge badge-pill badge-success">{{ postSingle.votePros }}</small>
                    <small class="badge badge-pill badge-danger">{{ postSingle.voteCons }}</small>
                    <button class="fas fa-angle-down" v-on:click="voteTarget(postSingle, 'post', false)"></button>
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
                      <button  class="btn btn-secondary btn-sm" title="Éditer cette version" v-on:click="editActiveVersion">Edit</button>
                      <button  class="btn btn-danger btn-sm" title="supprimer cette version" v-on:click="deleteActiveVersion">Suppr</button>
                    </div>

                </div>
                <div class="col-md-6 col-12">
                    <button class="fas fa-angle-up" v-on:click="voteTarget(postSingle.active_version, 'version', true)"></button>
                    <small class="badge badge-pill badge-success">{{ postSingle.active_version.votePros }}</small>
                    <small class="badge badge-pill badge-danger">{{ postSingle.active_version.voteCons }}</small>
                    <button class="fas fa-angle-down" v-on:click="voteTarget(postSingle.active_version, 'version', false)"></button>
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
                <div class="col-12">
                    <button v-for="version in postSingle.versions" v-on:click="changeVersion(version._id)" class="btn btn-outline-secondary">
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
                        <td>{{ comment.content }}</td>
                        <td>
                            <button class="fas fa-angle-up" v-on:click="voteTarget(comment, 'comment', true)"></button>
                            <small class="badge badge-pill badge-success">{{ comment.votePros }}</small>
                            <small class="badge badge-pill badge-danger">{{ comment.voteCons }}</small>
                            <button class="fas fa-angle-down" v-on:click="voteTarget(comment, 'comment', false)"></button>
                        </td>
                        <td v-if="authUserData.id == comment.author_id">
                          <button class="btn btn-secondary btn-sm" title="Éditer mon commentaire" v-on:click="editComment(comment._id)">Edit</button>
                          <button class='btn btn-danger btn-sm'  title="supprimer le commentaire" v-on:click="deleteComment(comment._id)">Suppr</button>
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
import {
    mapState
} from 'vuex'

export default {
    data: function() {
        return {
            name: 'PostSingleComponent',
            commentToAdd: '',
            userIsAuthorOfPost: false,
            userIsAuthorOfActiveVersion: false
        }
    },
    computed: {
        ...mapState([
            'postSingle',
            'authUserData'
        ])
    },
    methods: {
        changeVersion: function(version_id) {

            let payload = {
                post_id: this.postSingle._id,
                version_id: version_id
            };

            this.$store.dispatch('changePostVersionAction', payload)
            .then((response)=>{
              this.updateUserRights();
            }, (error)=>{
              console.error(error);
            });
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

        voteTarget: function(target, type, vote) {

            let postId = this.$route.params.postId ? this.$route.params.postId : null;
            let payload = {
                type: type,
                vote: vote,
                target: target,
                listType: null,
                postId: postId,
                groupId: null
            }
            //console.log(payload);
            this.$store.dispatch('voteAction', payload);
        },

        goBack: function() {
            this.$router.go(-1);
        },

        createVersion: function() {
          this.$router.push('/creer-une-version');
        },

        updateUserRights: function() {
          this.userIsAuthorOfPost = (this.authUserData.id == this.postSingle.author_id) ? true : false;
          this.userIsAuthorOfActiveVersion = (this.authUserData.id == this.postSingle.active_version.author_id) ? true : false;
        },

        editPost: function() {
          //this.$router.push('/editer-un-article/'+this.postSingle._id);
          //preparer un UpdatePostComponent.vue qui appellera this.$store.dispatch('updatePost', this.postSingle._id);
        },
        deletePost: function() {
          this.$store.dispatch('deletePost', this.postSingle._id)
          .then((response)=>{
            console.log(response);
            this.$router.push('/groupe/'+this.postSingle.group_id);
          },(error)=>{
            console.error(error);
          });
        },
        editActiveVersion: function() {
          //this.$router.push('/editer-une-version/'+this.postSingle.active_version._id);
          //preparer UpdateVersionComponent.vue
          //UpdateVersionComponent.save()=>this.$store.dispatch('updateVersion', this.postSingle.active_version._id);
        },
        deleteActiveVersion: function() {
          this.$store.dispatch('deleteVersion', this.postSingle.active_version._id)
          .then((response)=>{
            this.$store.dispatch('initPostSingleAction', {postId:this.postSingle._id});//reload post with updated versions list
            this.$router.push('/article/'+this.postSingle._id);
          }, (error)=>{
            console.error(error);
          });
        },
        editComment: function(commentId) {
          //afficher un formulaire d'édition sous le commentaire à éditer
          //(rajouter une methode showCommentEditForm())
          //la soumission du formualire appèlera cette méthode
          //this.$store.dispatch('updateComment', commentId);
        },
        deleteComment: function(commentId) {
          let payload = {
            postId: this.postSingle._id,
            versionId: this.postSingle.active_version._id,
            commentId: commentId
          };
          this.$store.dispatch('deleteComment', payload)
          .then((response)=>{
            //
          }, (error)=>{
            console.error(error);
          });
        }
    },
    created: function() {
        this.$store.dispatch('initPostSingleAction', {
            postId: this.$route.params.postId
        })
        .then((response) => {
          //console.log(response);
          //console.log(this.postSingle);
          this.updateUserRights();

        }, (error) => {
          console.error(error);
        });
    }
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
