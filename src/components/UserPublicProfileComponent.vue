<template>
<main>
    <div class="row align-items-center justify-content-center p-0 m-0 card-bg1">
        <div class="col-sm-8 col-11 card-bg1 py-4">
            <h2 class="text-center">Profil de {{ userData.user_name }}</h2>
        </div>
        <div class="col-sm-1 col-1 card-bg1 align-self-stretch d-flex flex-column align-items-end p-0 m-0">
            <small v-if="authUserIsFollowing" title="Ne plus suivre cet utilisateur" v-on:click="unfollowUser" class="cursor square-btn bg-info text-center pt-1">
                <i class="fas fa-bookmark"></i>
            </small>
            <small v-else title="Suivre cet utilisateur" v-on:click="followUser" class="cursor square-btn bg-secondary text-center pt-1">
                <i class="far fa-bookmark"></i>
            </small>
        </div>
        <div class="col-sm-3 col-12 card-bg2 align-self-stretch d-flex p-0 m-0">
            <div class="profile_pic m-auto py-4">
                <img :src="userProfilePicUrl" />
            </div>
        </div>
    </div>
    <div class="row align-items-center justify-content-center p-0 m-0">
        <div class="col-sm-9 col-12 card-bg2 p-4">
            <div class="row">
                <div class="col-12 form-group">
                    <h4 class="text-center">Informations Personnelles</h4>
                </div>
                <div class="col-12 form-group">
                    <label>Présentation :</label>
                    <p class="card-text1">{{ userPresentation }}</p>
                </div>
                <div class="col-12 form-group">
                    <label>Centres d'interêt :</label>
                    <p class="card-text1">{{ userInterests }}</p>
                </div>
                <div class="col-12 form-group">
                    <label>Liens :</label>
                    <div class="">
                        <a class="searchUserPostsLink" v-on:click="searchUserPosts">Publications</a>
                    </div>

                    <div v-for="link in userLinks" class="">
                        <a class="card-text1" :href="link.url">{{ link.url }}</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-3 col-12 card-bg1 d-flex flex-column justify-content-around align-self-stretch p-0 m-0">

        </div>
    </div>
</main>
</template>

<script>
import {
    mapState
} from 'vuex'
const axios = require('axios');
import config from '@/env_config'

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
                this.userProfilePicUrl = config.hostPublicUrl + 'blank_profile_pic.png';
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
            axios.put(config.hostPublicUrl + 'api/followuser/' + userId, {}, {
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
            axios.put(config.hostPublicUrl + 'api/unfollowuser/' + userId, {}, {
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
            axios.get(config.hostPublicUrl + 'api/userdata/' + userId, {
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
        this.$store.dispatch('getNotificationsAction');
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
    },
    watch: {
        '$route': function(to, from) {

            let userName = to.params.userName;
            let userId = to.params.userId;

            this.getUserPublicData();
            this.$store.dispatch('getNotificationsAction');
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

}

.profile_pic img {
    width: 100%;
}


.searchUserPostsLink {
    cursor: pointer;
}
</style>
