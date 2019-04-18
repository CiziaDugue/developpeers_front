<template>
  <main>
      <div class="card">
          <div class="card-title">
              <h2>Mon profil</h2>
          </div>
          <div class="card-body">
              <div class="profile_pic">
                <img :src="profilePicUrl"/>
                <button type="button" class="btn btn-sm btn-outline-primary" v-on:click="togglePicForm" title="Changer ma photo de profil"> <i class="fas fa-camera"></i> </button>
              </div>

              <div class="changePicForm" v-if="changePicForm">
                    <button type="button" class="close closePicForm" aria-label="Close" v-on:click='closePicForm'>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <form class="form-inline">
                        <input class="form-control" type="file" ref="file" v-bind:name="authUserData.id" v-on:change="handlePicFile">
                        <button class="btn btn-success" type="button" v-on:click='submitPic'>ok</button>
                    </form>
              </div>

              <div class="list-group list-group-flush">
                  <ul>
                      <li class="list-group-item">Nom : {{authUserData.name}}</li>
                      <li class="list-group-item">Email : {{ authUserData.email }}</li>
                      <li class="list-group-item"> <a href="">Réinitialiser mon mot de passe</a></li>
                      <li class="list-group-item"> <a href="">Supprimer mon compte</a></li>
                  </ul>
              </div>
          </div>

      </div>
  </main>
</template>

<script>
import {
    mapState
} from 'vuex'
const axios = require('axios');

export default {
    data: function() {
        return {
            name: 'ProfileComponent',
            changePicForm: false
        }
    },
    computed: {
      ...mapState([
        'authUserData',
        'userLogged',
        'profilePicUrl'
      ])
    },

    methods: {
        togglePicForm: function() {
            this.changePicForm = true;
        },
        closePicForm: function() {
            this.changePicForm = false;
        },
        handlePicFile: function() {
            this.profilePicFile = this.$refs.file.files[0];
        },

        submitPic: function() {
            let formData = new FormData();
            formData.append('file', this.profilePicFile);
            this.$store.dispatch('uploadProfilePic', formData)
            .then((response)=>{
                //console.log(response.data);
                console.log("Profile image successfully uploaded");
                this.$router.go();
                //console.log(this.profilePicUrl);
            }, (error)=>{
                console.error(error);
            });
        }
    },

    created: function() {
        if (!this.userLogged) {
            this.$store.dispatch('autoLogin')
                        .then((response)=>{
                            //
                        }, (error)=>{
                            console.error(error);
                            this.$router.push('/login');
                        });
        }
    }
}
</script>

<style scoped>
main {
    /* position: relative;
    left: 50px;
    top: 100px;
    max-width: 1200px;
    margin: 0 auto; */
    border: 1px solid #eee;
}

.profile_pic {
    width: 100px;

}

.profile_pic img {
    width: 100%;
}

.changePicForm {
    padding: 30px;
    position: absolute;
    background-color: #fff;
    z-index: 2;
    top: 20%;
    left: 18%;
    box-shadow: 0 2px 10px #0002;
    border-radius: 3px;
}

.closePicForm {
    position: absolute;
    top: 3px;
    right: 6px;
}
</style>
