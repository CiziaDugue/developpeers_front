<template>
  <main>
    <form>
      <h2>Céer un article</h2>
      <div class="alert alert-danger" v-if="invalidFormMsg != ''">
        {{invalidFormMsg}}
      </div>
      <div class="form-group">
        <label>Titre</label>
        <input type="text" name="name" placeholder="Titre de l'article" class="form-control" v-model="title" v-on:keyup.enter="createPost">
      </div>

      <div class="form-group">
        <label>Mots-clés</label>
        <input type="text" name="keywords" placeholder="Tapez des mots clés séparés par des espaces" class="form-control" v-model="keywords" v-on:keyup.enter="createPost">
      </div>

      <div class="form-group">
        <textarea placeholder="Tapez votre message d'intro ici" class="form-control" v-model="textContent" v-on:keyup.enter="createPost"></textarea>
      </div>

      <div v-for="snippet in codeSnippets">
        <div class="form-group">
          <textarea placeholder="Tapez du code ici" class="form-control" v-model="codeSnippets[snippet.index].content" v-on:keyup.enter="createPost"></textarea>
        </div>
      </div>

      <div class="form-group">
        <button type="button" name="button" v-on:click="addCodeSnippet">Ajouter un bloc de code</button>
      </div>

      <div class="form-group" v-if="!fromGroup">
        <label>Choisissez un groupe</label>
        <select  v-model="selectedGroup" v-on:keyup.enter="createPost">
          <optgroup label="mes-groupes">
            Mes groupes
          </optgroup>
          <option v-for="group in groupsList" :key="group._id" v-bind:value="group._id">{{group.name}}</option>
        </select>
      </div>

      <div class="from-group" v-if='fromGroup'>
        <span>Groupe : {{groupSingle.name}}</span>
      </div>

      <div class="form-group">
        <input type="button" value="Poster" class="btn btn-success" v-on:click="createPost">
      </div>

    </form>
  </main>
</template>

<script>
import {mapState} from 'vuex'

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

                      }, (error)=>{
                          console.error(error);
                          this.$router.push('/login');
                      });
     } else {
         if(this.$route.params.groupId) this.initFromGroupForm(this.$route.params.groupId);
         else this.initRegularForm();
      }
  }
}
</script>

<style lang="css" scoped>

main {
    position: relative;
    right: 0;
    top: 140px;
    width: 1000px;
    margin: 0 auto;
}

form {
  border: 1px solid #ccc;
  padding: 30px;
  box-shadow: 2px 2px 8px #eee;
}

</style>
