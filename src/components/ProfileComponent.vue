<template>
  <main>
      <div class="card">
          <div class="card-title">
              <h2>Mon profil</h2>
          </div>
          <div class="card-body">
              <div class="profile_pic">
                <img :src="profilePicUrl"/>
                <button type="button" class="btn btn-sm btn-outline-primary changePicBtn" v-on:click="togglePicForm" title="Changer ma photo de profil"> <i class="fas fa-camera"></i> </button>
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

              <div class="updateDataForm">
                  <h4>Mettre mes infos à jour</h4>
                  <form>
                      <div class="form-group">
                          <label>Présentation</label>
                          <textarea-autosize name="user_presentation" class="form-control rounded-0" v-model="userPresentation"></textarea-autosize>
                      </div>
                      <div class="form-group">
                          <label>Centres d'interet - </label>
                          <small><i>Mots-clés séparés par des espaces</i></small>
                          <input class="form-control rounded-0" type="text" name="user_interests" v-model="userInterests">
                      </div>

                      <div class="form-group">
                          <label>Liens :</label>
                          <div v-for="link in userLinks">
                              <div class="form-group">
                                  <input placeholder="http://www.une-page-que-je-veux-montrer.com"
                                        type="text"
                                        class="form-control rounded-0"
                                        v-model="userLinks[link.index].url">
                              </div>
                          </div>

                          <div class="form-group">
                              <button type="button" class="rounded-0" name="button" v-on:click="addUserLink">+</button>
                          </div>
                      </div>

                      <div class="form-group">
                          <button type="button" class="btn btn-success" name="button" v-on:click="updateUserPublicData">Enregistrer</button>
                      </div>

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
            changePicForm: false,
            userLinks: [
                {
                    index: 0,
                    url: ''
                }
            ],
            uLinksLength : 1,
            userInterests: '',
            userPresentation: ''
        }
    },
    computed: {
      ...mapState([
        'authUserData',
        'userLogged',
        'profilePicUrl',
        'userPublicData'
      ])
    },

    methods: {
        addUserLink: function() {
          this.userLinks.push({index: this.uLinksLength, content: ""});
          this.uLinksLength++;
        },

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
        },

        initUserPublicData: function() {
            this.initUserLinks();
            this.userPresentation = this.userPublicData.user_presentation;
            this.initUserInterests();
        },

        initUserLinks: function() {
            if (this.userPublicData.user_links.length > 0) {
                this.userLinks = [];
                this.uLinksLength = 0;
                for (let i = 0; i < this.userPublicData.user_links.length; i++) {
                    this.userLinks[i] = {
                        index: i,
                        url: this.userPublicData.user_links[i]
                    };
                    this.uLinksLength = i + 1;
                }
            }
        },
        initUserInterests: function() {
            this.userInterests = "";
            if (this.userPublicData.user_interests.length > 0) {
                this.userPublicData.user_interests.forEach((word)=>{
                    this.userInterests += word + " ";
                });
                //remove final white space
                this.userInterests = this.userInterests.substring(0, this.userInterests.length - 1);
            }
        },
        updateUserPublicData: function() {

            let payload = {
                user_presentation: this.userPresentation,
                user_links: [],
                user_interests: []
            };

            payload.user_interests = this.userInterests.split(" ");

            this.userLinks.forEach((link)=>{
                payload.user_links.push(link.url);
            });

            this.$store.dispatch('updateUserPublicDataAction', payload)
                        .then((response)=>{
                            this.initUserPublicData();
                        }, (error)=>{
                            console.error(error);
                        });
        }
    },

    mounted() {
        this.$store.dispatch('getUserPublicDataAction')
                                        .then((response)=>{
                                            this.initUserPublicData();
                                            console.log(response);
                                        }, (error)=>{
                                            console.error(error);
                                        });
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
.card {
    padding: 20px;
    border-radius: 0;
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
    box-shadow: 3px 2px 8px #0002;
    border-radius: 3px;
}

.changePicBtn {
    position: relative;
    top : -30px;
    visibility: hidden;
}

.profile_pic:hover .changePicBtn {
    visibility: visible;
}

.closePicForm {
    position: absolute;
    top: 3px;
    right: 6px;
}
</style>
