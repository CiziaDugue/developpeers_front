<template>
<main>
    <div class="row align-items-center justify-content-center p-0 m-0">
        <div class="col-sm-8 col-11 card-bg2 py-4">
            <h2 class="text-center">Mon Profil</h2>
        </div>
        <div class="col-sm-1 col-1 card-bg2 align-self-stretch d-flex flex-column align-items-end p-0 m-0">
            <small v-if="!userDataView" class="cursor square-btn bg-secondary text-center pt-1" data-toggle="tooltip" data-placement="down" title="Informations personnelles" v-on:click="toggleUserDataView">
                <i class="far fa-user"></i>
            </small>
            <small v-else class="square-btn bg-success text-center pt-1">
                <i class="fas fa-user"></i>
            </small>
            <small v-if="!followersFollowingView" class="cursor square-btn bg-secondary text-center pt-1" data-toggle="tooltip" data-placement="down" title="Utilisateurs suivis" v-on:click="toggleFollowersFollowingView">
                <i class="fas fa-users"></i>
            </small>
            <small v-else class="square-btn bg-primary text-center pt-1" title="Valider les changements">
                <i class="fas fa-users"></i>
            </small>
            <small v-if="!optionsView" class="cursor square-btn bg-secondary text-center pt-1" data-toggle="tooltip" data-placement="down" title="Paramètres" v-on:click="toggleOptionsView">
                <i class="fas fa-tools"></i>
            </small>
            <small v-else class="square-btn bg-warning text-center pt-1" title="Valider les changements">
                <i class="fas fa-tools"></i>
            </small>
        </div>
        <div class="col-sm-3 col-12 card-bg1 align-self-stretch d-flex p-0 m-0">
            <div class="profile_pic m-auto pt-4">
                <img :src="profilePicUrl" />
                <p class="cursor bg-info text-center pt-1 changePicBtn" v-on:click="togglePicForm" title="Changer ma photo de profil">
                    <i class="fas fa-camera"></i>
                </p>
                <div class="changePicForm" v-if="changePicForm">
                    <button type="button" class="close closePicForm" aria-label="Close" v-on:click='closePicForm'>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <form class="form-inline">
                        <div class="input-group mb-3 rounded-0">
                            <div class="input-group">
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input rounded-0" id="picInput" ref="file" v-bind:name="authUserData.id" v-on:change="handlePicFile">
                                    <label class="custom-file-label" for="picInput">
                                        Aucun fichier choisi
                                    </label>
                                </div>
                                <div class="input-group-append">
                                    <button class="cursor rounded-0 border-0 btn-success" type="button" v-on:click='submitPic'>
                                        <i class="fas fa-check"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="row align-items-center justify-content-center p-0 m-0">
        <div v-if="userDataView" class="col-sm-8 col-11 card-bg1 p-4">
            <div class="row">
                <div class="col-12 form-group">
                    <h4 class="text-center">Informations Personnelles</h4>
                </div>
                <div class="col-12 form-group">
                    <label>Présentation :</label>
                    <p v-if="!editMode" class="card-text1">{{ userPresentation }}</p>
                    <textarea-autosize v-else name="user_presentation" class="form-control rounded-0 card-bg2" v-model="userPresentation"></textarea-autosize>
                </div>
                <div class="col-12 form-group">
                    <label>Centres d'interêt :</label>
                    <p v-if="!editMode" class="card-text1">{{ userInterests }}</p>
                    <input v-if="editMode" class="form-control rounded-0 card-bg2" type="text" name="user_interests" v-model="userInterests">
                    <small v-if="editMode" class="d-block"><i>Mots-clés séparés par des espaces</i></small>
                </div>
                <div class="col-12 form-group">
                    <label>Liens :</label>
                    <div v-if="!editMode" v-for="link in userLinks" class="">
                        <a class="card-text1" :href="link.url">{{ link.url }}</a>
                    </div>
                    <div v-if="editMode" v-for="link in userLinks">
                        <div class="form-group">
                            <input placeholder="http://www.une-page-que-je-veux-montrer.com" type="text" class="form-control rounded-0 card-bg2 pb-2" v-model="userLinks[link.index].url">
                        </div>
                    </div>
                    <div v-if="editMode" class="form-group row justify-content-center">
                        <small class="cursor strong-white square-btn bg-secondary text-center pt-1" v-on:click="addUserLink" title="Ajouter un bloc de code">
                            <i class="fas fa-plus"></i>
                        </small>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="userDataView" class="col-sm-1 col-1 card-bg1 align-self-stretch d-flex flex-column align-items-end p-0 m-0">
            <small v-if="!editMode" class="cursor square-btn bg-primary text-center pt-1" data-toggle="tooltip" data-placement="down" title="Editer les informations personnelles" v-on:click="toggleEditMode">
                <i class="fas fa-edit"></i>
            </small>
            <small v-else class="cursor square-btn bg-success text-center pt-1" v-on:click="updateUserPublicData" title="Valider les changements">
                <i class="fas fa-check"></i>
            </small>
        </div>
        <div v-if="followersFollowingView" class="col-sm-9 col-12 card-bg1 p-4">
            <div class="row">
                <div class="col-12 form-group pb-2">
                    <h4 class="text-center pb-1">Following</h4>
                    <div class="row justify-content-around">
                        <div v-for="(following, key, index) in userPublicData.following" class="col-3 d-flex justify-content-around align-items-center">
                            <router-link v-if="following.name != 'bug fixing example'" :to="{ name: 'userPublicProfile', params: {userId: following.id, userName: following.name.replace(' ', '-')} }" class="align-self-center">
                                {{ following.name }}
                            </router-link>
                            <p v-if="following.name != 'bug fixing example'" class="cursor square-btn bg-secondary text-center pt-1" data-toggle="tooltip" data-placement="down" title="Ne plus suivre" v-on:click="unfollowUser(following.id)">
                                <i class="fas fa-times"></i>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-12 form-group pb-2">
                    <h4 class="text-center pb-1">Followers</h4>
                    <div class="row justify-content-around">
                        <div v-for="(follower, key, index) in userPublicData.followers" class="col-3 d-flex justify-content-around align-items-center">
                            <router-link v-if="follower.name != 'bug fixing example'" :to="{ name: 'userPublicProfile', params: {userId: follower.id, userName: follower.name.replace(' ', '-')} }" class="align-self-center">
                                {{ follower.name }}
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="optionsView" class="col-sm-9 col-12 card-bg1 p-4">
            <div class="row">
                <div class="col-12 form-group">
                    <h4 class="text-center">Paramètres</h4>
                </div>
                <div class="col-12 form-group">
                    <label>Thème couleur du site</label>
                </div>
                <div class="col-12 form-group">
                    <label>Thème couleur de extraits de code</label>
                </div>
            </div>
        </div>
        <div class="col-sm-3 col-12 card-bg2 d-flex flex-column justify-content-around align-self-stretch p-0 m-0">
            <p class="text-center card-text2">
                Nom : <strong>{{authUserData.name}}</strong>
            </p>
            <p class="text-center card-text2">
                Email : {{ authUserData.email }}
            </p>
            <p class="text-center card-text2">
                <a href="">Réinitialiser mon mot de passe</a>
            </p>
            <p class="text-center card-text2">
                <a href="">Supprimer mon compte</a>
            </p>
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
            userLinks: [{
                index: 0,
                url: ''
            }],
            uLinksLength: 1,
            userInterests: '',
            userPresentation: '',
            editMode: false,
            userDataView: true,
            followersFollowingView: false,
            optionsView: false
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
        toggleUserDataView: function() {
            this.userDataView = true;
            this.followersFollowingView = false;
            this.optionsView = false;
        },
        toggleFollowersFollowingView: function() {
            this.userDataView = false;
            this.followersFollowingView = true;
            this.optionsView = false;
        },
        toggleOptionsView: function() {
            this.userDataView = false;
            this.followersFollowingView = false;
            this.optionsView = true;
        },
        toggleEditMode: function() {
            this.editMode = true;
        },

        addUserLink: function() {
            this.userLinks.push({
                index: this.uLinksLength,
                content: ""
            });
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
                .then((response) => {
                    //console.log(response.data);
                    console.log("Profile image successfully uploaded");
                    this.$router.go();
                    //console.log(this.profilePicUrl);
                }, (error) => {
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
                this.userPublicData.user_interests.forEach((word) => {
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

            this.userLinks.forEach((link) => {
                payload.user_links.push(link.url);
            });

            this.$store.dispatch('updateUserPublicDataAction', payload)
                .then((response) => {
                    this.initUserPublicData();
                }, (error) => {
                    console.error(error);
                });

            this.editMode = false;
        },
        unfollowUser: function(userId) {
            axios.put('http://localhost/developeers/public/api/unfollowuser/' + userId, {}, {
                    headers: this.$store.state.headerObject
                })
                // .then((response) => {
                //     //console.log(response.data);
                //     this.getUserPublicData();
                // })
                .catch((error) => {
                    console.error(error);
                });
        },
    },

    mounted() {
        this.$store.dispatch('getUserPublicDataAction')
            .then((response) => {
                this.initUserPublicData();
                console.log(response);
            }, (error) => {
                console.error(error);
            });
    },

    created: function() {
        if (!this.userLogged) {
            this.$store.dispatch('autoLogin')
                .then((response) => {
                    //
                }, (error) => {
                    console.error(error);
                    this.$router.push('/login');
                });
        }
    }
}
</script>

<style scoped>
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

/* .card {
    padding: 20px;
    border-radius: 0;
} */

.profile_pic {
    width: 100px;
    position: relative;
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
    left: -200%;
    box-shadow: 3px 2px 8px #0002;
    /* border-radius: 3px; */
}

.changePicBtn {
    position: relative;
    width: 30px;
    height: 30px;
    left: +70px;
    bottom: +30px;
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
