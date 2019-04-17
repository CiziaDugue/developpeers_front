<template>
<main>
    <form>
        <h2>Éditer une nouvelle version</h2>
        <div class="alert alert-danger" v-if="invalidFormMsg != ''">
            {{invalidFormMsg}}
        </div>
        <div class="form-group">
            <h3>{{title}}</h3>
        </div>
        <div class="form-group">
            <p>Version : {{number}}</p>
        </div>

        <div class="form-group">
            <textarea class="form-control" v-model="textContent"></textarea>
        </div>

        <div v-for="snippet in codeSnippets">
            <div class="form-group">
                <textarea class="form-control" v-model="codeSnippets[snippet.index].content"></textarea>
            </div>
        </div>

      <div class="form-group">
        <textarea class="form-control" v-model="textContent"></textarea>
      </div>

      <div v-for="snippet in codeSnippets">
        <div class="form-group">
          <textarea class="form-control" v-model="codeSnippets[snippet.index].content" ></textarea>
        </div>
      </div>

      <div class="form-group">
        <input type="button" value="Valider les changements" class="btn btn-success">
      </div>

    </form>
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
      number: "",
      codeSnippets: [],
      csLength: 0,
      invalidFormMsg: ""
    }
  },
  computed: {
    ...mapState([
      'postSingle',
      'userLogged'
    ])
  },
  methods: {
    validateVersionUpdate: function() {

        if (this.title == ""
        || this.textContent == ""
        || this.codeSnippets[0].content == "") {

          this.invalidFormMsg = "Tous les champs doivent être remplis.";

      } else {
          let payload = {
            post_id: this.postSingle._id,
            version_id: this.postSingle.active_version._id,
            requestData: {
              text_content: this.textContent,
              code_snippets: []
            }
          };

          let i=0;
          this.codeSnippets.forEach( (cs) => {
            payload.requestData.code_snippets[i] = cs.content;
            i++;
          });
          this.$store.dispatch('updateVersion', payload)
          .then((response)=>{
            this.$router.push('/article/'+this.postSingle._id);
          },(error)=>{
            console.log(error);
          });
      }
    },
    initForm: function() {
        this.title = this.postSingle.title;
        this.textContent = this.postSingle.active_version.text_content;
        let i=0;
        this.postSingle.active_version.code_snippets.forEach((cs)=> {
          this.codeSnippets[i] = {
            index: i,
            content: cs.content
          };
          i++;
        });
        this.csLength = i;
        this.number = this.postSingle.active_version.number;
    }
  },
  created: function() {
      if (!this.userLogged) {
          this.$store.dispatch('autoLogin')
                      .then((response)=>{
                          if(!this.postSingle.title) {
                              let payload = {postId: this.$route.params.postId};
                              this.$store.dispatch('initPostSingleAction', payload)
                              .then((response)=>{
                                  let vPayload = {
                                      post_id: this.$route.params.postId,
                                      version_id: this.$route.params.versionId
                                  }
                                  this.$store.dispatch('changePostVersionAction', vPayload)
                                            .then((vResponse)=>{
                                                this.initForm();
                                            }, (vError)=>{
                                                console.error(error);
                                            });
                              }, (error)=>{
                                  console.error(error);
                                  this.$router.push('/');//tmp
                              });
                          } else {
                              this.initForm();
                          }
                      }, (error)=>{
                          console.error(error);
                          this.$router.push('/login');
                      });

      } else {
          this.initForm();
      }
  }

}
</script>

<style lang="css" scoped>

main {
    /* position: relative;
    right: 0;
    top: 140px;
    width: 1000px;
    margin: 0 auto; */
}

form {
  border: 1px solid #ccc;
  padding: 30px;
  box-shadow: 2px 2px 8px #eee;
}

</style>
