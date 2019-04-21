<template>
<div class="topBarCtnr fixed-top">
    <div class="topBarContentBlock">
        <!-- Logged user responsive menu : -->
        <div class="smallWindowMenu dropdown border-0 p-0 m-0" v-if="smallWindowMode && userLogged">
            <button type="button"
                    class="logo-small btn-secondary dropdown-toggle rounded-0 border-0 pl-4 m-0"
                    id="smallWindowMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                <i class="fas fa-bars pr-2"></i>
            </button>
            <!-- <router-link class="pl-2" :to="{ path: '/' }">
                <img class="logo-small-resp" src="../assets/logo.png">
            </router-link> -->
            <a class="pl-2">
                <img v-on:click="refreshHomePage" class="logo-small-resp" src="../assets/logo.png">
            </a>
            <div class="dropdown-menu" aria-labelledby="smallWindowMenuButton">
                <router-link class="dropdown-item" to="/">Dashboard</router-link>
                <div class="dropdown-divider"></div>
                <router-link class="dropdown-item" to="/articles/mes-articles">Mes articles</router-link>
                <router-link class="dropdown-item" to="/articles/articles-suivis">Articles suivis</router-link>
                <router-link class="dropdown-item" to="/articles/creer-un-article">Créer un article</router-link>
                <div class="dropdown-divider"></div>
                <router-link class="dropdown-item" to="/groupes/tous-les-groupes">Tous les groupes</router-link>
                <router-link class="dropdown-item" to="/groupes/mes-groupes">Mes groupes</router-link>
                <router-link class="dropdown-item" to="/creer-un-groupe">Créer un groupe</router-link>
                <div class="dropdown-divider"></div>

                <router-link  class="dropdown-item" to="/profil">
                        <div class="profileTab">
                            <div class="profilePicCtnr">
                                <img :src="profilePicUrl">
                            </div>
                            <div>
                                <div>
                                    <b>{{authUserData.name}}</b>
                                </div>

                                <div>
                                    <small>Mon profil</small>
                                </div>
                            </div>

                        </div>
                </router-link>

            </div>
        </div>
        <!-- Guest user responsive menu : -->
        <div class="smallWindowMenu dropdown border-0 p-0 m-0" v-if="smallWindowMode && !userLogged">
            <button type="button"
                    class="logo-small btn-secondary dropdown-toggle rounded-0 border-0 pl-4 m-0"
                    id="smallWindowMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                <i class="fas fa-bars pr-2"></i>
            </button>
            <div class="dropdown-menu" aria-labelledby="smallWindowMenuButton">
                <router-link class="dropdown-item" to="/">Accueil</router-link>
                <div class="dropdown-divider"></div>
                <router-link class="dropdown-item" to="/login">Se connecter</router-link>
                <router-link class="dropdown-item" to="/register">S'inscrire</router-link>
            </div>
            <router-link class="pl-2" :to="{ path: '/' }">
                <img class="logo-small-resp" src="../assets/logo.png">
            </router-link>
        </div>

        <!-- Regular screen topBar -->
        <div class="rootLogoBlock" v-if="!smallWindowMode">
            <!-- <router-link :to="{ path: '/' }">
                <img class="logo-small" src="../assets/logo-title.png">
            </router-link> -->
            <img v-on:click="refreshHomePage" class="logo-small" src="../assets/logo-title.png">
        </div>

        <div class="searchBlock">
            <form>
                <div class="input-group input-group-sm">
                    <input type="search" class="searchBar" placeholder="Recherche par mots clés, auteur..." v-model="searchBarContent" v-on:keyup.enter="getSearchResult">
                    <!-- <div class="input-group-append">
                        <button type="button" class="btn btn-outline-primary my-2 my-sm-0 searchBtn rounded-0" v-on:click="getSearchResult">
                            <i class="fa fa-search"></i>
                        </button>
                    </div> -->
                </div>
            </form>
        </div>

        <div class="userBlock" v-if="!userLogged && !smallWindowMode">
            <div class="userSubBlock">
                <router-link to='/login' class="text-white">Se Connecter</router-link>
            </div>
            <div class="userSubBlock pl-4">
                <router-link to="/register" class="text-white">S'inscrire</router-link>
            </div>
        </div>

        <div class="userBlock d-flex align-items-center justify-content-end" v-if="userLogged">
            <div v-if="!smallWindowMode" class="profilePicCtnr">
                <img :src="profilePicUrl">
            </div>
            <router-link v-if="!smallWindowMode" to="/profil"><strong class="text-white ml-4">{{authUserData.name}}</strong></router-link>

            <div class="d-flex flex-column ml-4 justify-content-start align-items-end">
                <small v-on:click="disconnectUser" class="cursor square-btn bg-danger text-center pt-1" title="Se déconnecter">
                     <i class="fas fa-power-off"></i>
                </small>
                <notification-component></notification-component>
            </div>
        </div>

    </div>
</div>
</template>

<script>
import {mapState} from 'vuex'
import NotificationComponent from '@/components/NotificationComponent.vue'

export default {
    data: function() {
        return {
            name: 'TopBarComponent',
            searchBarContent: '',
            windowWidth: window.innerWidth
        }
    },
    computed: {
        ...mapState([
            'userLogged',
            'authUserData',
            'profilePicUrl'
        ]),
        smallWindowMode () {
            return this.windowWidth <= 1100;
        }
    },
    components: {
        NotificationComponent
    },
    methods: {
        disconnectUser: function() {
            this.$store.dispatch('disconnectUser');
            this.$router.push('/');
        },
        //special route from there
        getSearchResult: function() {
            let routeParamString = this.searchBarContent.replace(" ", "+");

            if (this.userLogged) {
                this.$store.dispatch('getSearchResult', this.searchBarContent)
                    .then((response) => {
                        if (response != "feed") {
                            this.$router.push('/search/' + routeParamString);
                        } else {
                            this.$router.push('/');
                        }

                    }, (error) => {
                        console.error(error);
                    });
            } else {
                this.$store.dispatch('getGuestSearchResults', this.searchBarContent)
                    .then((response) => {
                        if (response != "feed") {
                            this.$router.push('/search/' + routeParamString);
                        } else {
                            this.$router.push('/');
                        }
                    }, (error) => {
                        console.error(error);
                    });
            }
        },

        refreshHomePage: function() {
            this.$store.dispatch('getPostsFeed')
                        .then((response)=>{
                            this.$router.push('/');
                        }, (error)=>{
                            console.error(error);
                        });
        },
    },

    mounted: function() {

        window.addEventListener('resize', () => {
            this.windowWidth = window.innerWidth;
        });

        this.$store.dispatch("getUserProfilePic")
            .then((response) => {
                //console.log(response);
            }, (error) => {
                console.error(error);
            });
    }
}
</script>

<style scoped>
.topBarCtnr {
    height: 60px;
    padding: 5px 0px;
    background-color: #27272b;
    /* overflow: hidden; */
}

.topBarContentBlock {
    display: flex;
    max-width: 1400px;
    margin: 0 auto;
    justify-content: space-between;
    align-items: center;
    height: 100%;
}

.rootLogoBlock {
    flex: 1;
}

.userBlock {
    flex: 1;
    display: flex;
}

.searchBlock {
    flex: 3;
}

.searchBar {
    width: 70%;
    margin: 0 auto;
}

.dropdown-menu {
    border-radius: 0;
    box-shadow: none;
}

.smallWindowMenu {
    /* position: fixed;
    top: 0;
    left: 0; */
}

@media (max-width: 800px) {
    /* .searchBlock {
        flex: auto;
    }
    .userBlock {
        flex: auto;
    }
    .searchBar {
        margin: 2px;
    } */
    .topBarCtnr {
        /* padding: 5px 8px; */
    }
}
@media (max-width: 540px) {
    /* .searchBlock {
        flex: auto;
    }
    .userBlock {
        flex: auto;
    }
    .searchBar {
        margin: 2px;
    } */
    .dropdown-menu {
        width: 96vw;
    }
}

/* .userSubBlock {
    flex: auto;
    border-left: 1px solid #fff2;
    display: flex;
    justify-content: center;
    align-items: center;
} */

.userSubBlock:last-child {
    /* border-right: 1px solid #fff2; */
}

.profilePicCtnr {
    width: 60px;
    height: 60px;
    /* margin: 0 5px; */
    overflow: hidden;
    display: flex;
    justify-content: center;
}
.profileTab {
    display: flex;
    text-decoration: none;
}
.profileTab small {
    color: #888;
}

.profilePicCtnr img {
    height: 100%;
}

.title {
    /* font-family: monospace; */
}

.logo-small-resp {
    height: 56px;
    width: auto;
    cursor: pointer;
}

.logo-small {
    cursor: pointer;
}
</style>
