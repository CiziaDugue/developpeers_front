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
                      <input type="text"  v-model="postEditedTitle">
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
                      <button  class="btn btn-secondary btn-sm" title="Éditer cet article" v-on:click="toggleEditMode">Edit</button>
                      <button  class="btn btn-danger btn-sm" title="Supprimer cet article" v-on:click="deletePost">Suppr</button>
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
                      <button  class="btn btn-secondary btn-sm" title="Éditer cette version" v-on:click="editActiveVersion">Edit</button>
                      <button  class="btn btn-danger btn-sm" title="supprimer cette version" v-on:click="deleteActiveVersion">Suppr</button>
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
                    <p class="text-center">{{ postSingle.active_version.text_content }}</p>
                    <p v-for="snippet in postSingle.active_version.code_snippets" class="border">
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
                        <td v-if="comment._id != editedCommentId || !commentEditMode">{{ comment.content }}</td>
                        <td v-if="commentEditMode && comment._id==editedCommentId">
                          <input type="text" v-model="commentEditedContent">
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
import {mapState} from 'vuex'

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
          this.$router.push('/creer-une-version');
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
            post_id: this.postSingle._id,
            version_id: this.postSingle.active_version._id,
            requestData: {
              title: this.postEditedTitle,
              keywords: arKeywords
            }
          };
          this.$store.dispatch('updatePost', payload);
          this.postEditMode = false;//pas la peine ?
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
          this.$router.push('/editer-une-version/'+this.postSingle.active_version._id);
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

        toggleCommentEditMode: function(commentId, commentContent) {
          this.commentEditMode = true;
          this.commentEditedContent = commentContent;
          this.editedCommentId = commentId;
        },

        validateCommentUpdate: function(commentId) {
          this.commentEditMode = false;
          let payload = {
            commentId: commentId,
            post_id: this.postSingle._id,
            version_id: this.postSingle.active_version._id,
            requestData: {
              content: this.commentEditedContent
            }
          };
          this.$store.dispatch('updateComment', payload)
          .then((response)=>{
            //console.log(response);
          }, (error)=>{
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
          .then((response)=>{
            //
          }, (error)=>{
            console.error(error);
          });
        }
    },
    created: function() {
        console.log("USER LOGGED : "+this.userLogged);
        if (this.userLogged) {
            this.$store.dispatch('initPostSingleAction', {
                postId: this.$route.params.postId
            })
            .then((response) => {
              this.postEditedTitle = this.postSingle.title;
              this.postEditedKeywords;
              this.postSingle.keywords.forEach((word)=> {
                this.postEditedKeywords += word + " ";
              });
              this.updateUserRights();

            }, (error) => {
              console.error(error);
            });
        } else {
            this.$router.push("/login");
        }

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
