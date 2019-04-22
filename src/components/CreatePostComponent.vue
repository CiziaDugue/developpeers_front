<template>
<main>
    <div class="row align-items-center justify-content-center">
        <div class="col-sm-9 col-12 card-bg2 p-5">
            <h2 class="text-center">Nouvel Article</h2>
        </div>
        <div class="col-sm-3 col-12 card-bg1 align-self-stretch">

        </div>
    </div>
    <div class="row align-items-center justify-content-center">
        <div class="col-sm-9 col-12 card-bg1 px-5 py-4">
            <form>
                <div class="alert alert-danger rounded-0" v-if="invalidFormMsg != ''">
                    {{invalidFormMsg}}
                </div>
                <div class="form-group">
                    <label>Titre :</label>
                    <input type="text" name="name" placeholder="Titre de l'article" class="form-control rounded-0 card-bg2" v-model="title">
                </div>

                <div class="form-group">
                    <label>Mots-clés :</label>
                    <input type="text" name="keywords" placeholder="Tapez des mots clés séparés par des espaces" class="form-control rounded-0 card-bg2" v-model="keywords">
                </div>

                <div class="form-group">
                    <label>Contenu texte :</label>
                    <textarea-autosize placeholder="Tapez votre message d'intro ici" class="form-control rounded-0 card-bg2" v-model="textContent"></textarea-autosize>
                </div>

                <div class="form-group">
                    <label>Contenu code :</label>
                    <div v-for="snippet in codeSnippets">
                        <div class="form-group">
                            <textarea-autosize placeholder="Tapez du code ici" class="form-control rounded-0 card-bg2" v-model="codeSnippets[snippet.index].content"></textarea-autosize>
                        </div>
                    </div>

                    <div class="form-group row justify-content-center">
                        <small class="cursor strong-white square-btn bg-secondary text-center pt-1" v-on:click="addCodeSnippet" title="Ajouter un bloc de code">
                            <i class="fas fa-plus"></i>
                        </small>
                    </div>
                </div>


                <div class="form-group" v-if="!fromGroup">
                    <label>Choisissez un groupe :</label>
                    <div>
                        <select class="custom-select card-bg2 rounded-0" v-model="selectedGroup">
                            <optgroup label="mes-groupes">
                                Mes groupes
                            </optgroup>
                            <option v-for="group in groupsList" :key="group._id" v-bind:value="group._id">{{group.name}}</option>
                        </select>
                    </div>
                </div>

                <div class="from-group" v-if='fromGroup'>
                    <span>Groupe : {{groupSingle.name}}</span>
                </div>

                <div class="form-group row justify-content-center pt-3">
                    <input type="button" value="Poster l'article" class="cursor-sm btn btn-primary rounded-0 strong-white" v-on:click="createPost">
                </div>

            </form>
        </div>
        <div class="col-sm-3 col-12 card-bg2 align-self-stretch">

        </div>
    </div>
</main>
</template>

<script>
import {
    mapState
} from 'vuex'

export default {
  data: function() {
    return {
      title: "",
      textContent: "",
      keywords: "",
      codeSnippets: [
        {index: 0,
        content: ""}
      ],
      csLength: 1,
      selectedGroup: "",
      fromGroup: false,
      invalidFormMsg: ""
    }
  },
  computed: {
    ...mapState([
      'groupsList',
      'groupSingle',
      'userLogged'
    ])
  },
  methods: {
    createPost: function() {
      if (this.title == ""
      || this.textContent == ""
      || this.codeSnippets[0].content == ""
      || this.keywords == ""
      || this.selectedGroup == "") {

        this.invalidFormMsg = "Tous les champs doivent être remplis.";
      } else {
        this.invalidFormMsg = "";

        let arKeywords = this.keywords.split(" ");

        let requestData = {
          title: this.title,
          text_content: this.textContent,
          code_snippets: [],
          group_id: this.selectedGroup,
          keywords: arKeywords
        };

        this.codeSnippets.forEach(function(snippet) {
          requestData.code_snippets.push(snippet.content);
        });

        this.$store.dispatch('createPost', requestData)
                    .then((response)=>{
                      this.$router.push('/article/'+response.data._id);
                    }, (error) => {
                      console.log(error);
                    });
      }
    },

    addCodeSnippet: function() {
      this.codeSnippets.push({index: this.csLength, content: ""});
      this.csLength++;
    },

    initFromGroupForm: function(groupId) {

        this.fromGroup = true;
        this.selectedGroup = groupId;

        if(!this.groupSingle.name) {
            this.$store.dispatch('initGroupSingleAction', groupId)
                        .then((response)=>{
                            //console.log(response);
                        }, (error)=>{
                            console.error(error);
                        });
        }
    },

    getNotifications: function() {
        this.$store.dispatch('getNotificationsAction');
        // console.log(this.$store.state.userNotifs);
        // console.log(this.userNotifs);
    },

    initRegularForm: function() {
        this.$store.dispatch('getUserGroups')
                    .then((response)=>{
                        //console.log(response);
                    }, (error)=>{
                        console.error(error);
                    });
    }
  },

  created: function() {
      if (!this.userLogged) {
          this.$store.dispatch('autoLogin')
                      .then((response)=>{
                          //console.log(response);
                          if(this.$route.params.groupId) this.initFromGroupForm(this.$route.params.groupId);
                          else this.initRegularForm();

                          this.getNotifications();

                      }, (error)=>{
                          console.error(error);
                          this.$router.push('/login');
                      });
     } else {
         if(this.$route.params.groupId) this.initFromGroupForm(this.$route.params.groupId);
         else this.initRegularForm();

         this.getNotifications();
      }
  }
}
</script>

<style lang="css" scoped>
.card-bg2 {
    /* background-color: #8baed3; */
    background-color: #c3d1dd;
}

.card-bg1 {
    /* background-color: #c3d1dd; */
    background-color: #fff;
}

.card-text2 {
    color: #57515b;
}

.card-text1 {
    color: #57515b;
}

/* form {
  border: 1px solid #ccc;
  padding: 30px;
  box-shadow: 2px 2px 8px #eee;
} */

</style>
