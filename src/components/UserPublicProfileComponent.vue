<template>
<main>
    <div class="row align-items-center justify-content-center p-0 m-0">
        <div class="col-sm-9 col-12 card-bg2 py-4">
            <h2 class="text-center">Profil de {{ userData.user_name }}</h2>
        </div>
        <!-- <div class="col-sm-1 col-1 card-bg2 align-self-stretch d-flex flex-column align-items-end p-0 m-0">
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
        </div> -->
        <div class="col-sm-3 col-12 card-bg1 align-self-stretch d-flex p-0 m-0">
            <div class="profile_pic m-auto pt-4">
                <img :src="userProfilePicUrl" />
            </div>
        </div>
    </div>
    <!-- <div class="row align-items-center justify-content-center">
        <div class="col-sm-9 col-12 card-bg2 p-4">
            <h2 class="text-center">Profil de {{ userData.user_name }}</h2>
        </div>
        <div class="col-sm-3 col-12 card-bg1 align-self-stretch d-flex">
            <div class="profile_pic m-auto pt-4">
                <img src="" />
            </div>
        </div>
    </div> -->

    <div>
        <button v-if="!authUserIsFollowing" type="button" v-on:click="followUser">Suivre</button>
        <button v-else type="button" v-on:click="unfollowUser">Ne plus suivre</button>
    </div>

    <div class="profile_pic">
        <img :src="userProfilePicUrl" />
    </div>

    <div>
        <h4>Presentation</h4>
        <p>{{userPresentation}}</p>
    </div>

    <div>
        <h4>Centre d'intérêts</h4>
        <p>{{userInterests}}</p>
    </div>

    <div>
        <h4>Liens</h4>
        <ul>
            <li v-for="link in userLinks">{{link.url}}</li>
        </ul>
    </div>

    <div>
         <h4 class="searchUserPostsLink" v-on:click="searchUserPosts">Publications</h4>
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
            userLinks: [],
            userInterests: '',
            userPresentation: '',
            userProfilePicUrl: '',
            userData: {},
            authUserIsFollowing: false
        }
    },
    computed: {
        ...mapState([
            'authUserData',
            'userLogged'
        ])
    },

    methods: {

        initUserPublicData: function(userPublicData) {
            this.authUserIsFollowing = this.isAuthUserFollowing(userPublicData);
            this.initUserLinks(userPublicData);
            this.userPresentation = userPublicData.user_presentation;
            this.initUserInterests(userPublicData);
            this.initProfilePic(userPublicData);
            this.userData = userPublicData;
        },

        isAuthUserFollowing: function(userPublicData) {
            let match = false;
            if (userPublicData.followers.length > 0) {
                for (let i = 0; i < userPublicData.followers.length; i++) {
                    if (userPublicData.followers[i].id == this.authUserData.id) {
                        match = true;
                        break;
                    }
                }
            }
            return match;
        },

        initProfilePic: function(userPublicData) {
            if (!userPublicData.profile_pic_url || userPublicData.profile_pic_url == "") {
                this.userProfilePicUrl = "http://localhost/developeers/public/blank_profile_pic.png";
            } else {
                this.userProfilePicUrl = userPublicData.profile_pic_url;
            }
        },

        initUserLinks: function(userPublicData) {
            if (userPublicData.user_links.length > 0) {
                this.userLinks = [];
                for (let i = 0; i < userPublicData.user_links.length; i++) {
                    this.userLinks[i] = {
                        index: i,
                        url: userPublicData.user_links[i]
                    };
                }
            }
        },
        initUserInterests: function(userPublicData) {
            this.userInterests = "";
            if (userPublicData.user_interests.length > 0) {
                userPublicData.user_interests.forEach((word) => {
                    this.userInterests += word + ", ";
                });
                //remove final white space and comma
                this.userInterests = this.userInterests.substring(0, this.userInterests.length - 2);
            }
        },

        followUser: function() {
            let userId = this.userData.user_id;
            axios.put('http://localhost/developeers/public/api/followuser/' + userId, {}, {
                    headers: this.$store.state.headerObject
                })
                .then((response) => {
                    //console.log(response.data);
                    this.getUserPublicData();
                })
                .catch((error) => {
                    console.error(error);
                });
        },

        unfollowUser: function() {
            let userId = this.userData.user_id;
            axios.put('http://localhost/developeers/public/api/unfollowuser/' + userId, {}, {
                    headers: this.$store.state.headerObject
                })
                .then((response) => {
                    //console.log(response.data);
                    this.getUserPublicData();
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        getUserPublicData: function() {
            let userId = this.$route.params.userId;
            axios.get('http://localhost/developeers/public/api/userdata/' + userId, {
                    headers: this.$store.state.headerObject
                })
                .then((response) => {
                    this.initUserPublicData(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        },
        searchUserPosts: function() {
            this.$store.dispatch('getSearchResult', this.userData.user_name)
            .then((response)=>{
                let route = "/search/"+this.userData.user_name.replace(' ', '-').toLowerCase();
                this.$router.push(route);
            }, (error)=>{
                console.error(error);
            });
        }
    },

    mounted() {
        this.getUserPublicData();
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
    top: -30px;
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

.searchUserPostsLink {
    cursor: pointer;
}
</style>
