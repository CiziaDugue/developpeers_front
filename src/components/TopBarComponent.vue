<template>
    <!-- <div class="top-bar fixed-top navbar navbar-dark navbar-expand-lg">

        <router-link :to="{ path: '/' }">
            <h1 class="title">Developeers</h1>
        </router-link>

        <form class="form-inline">
          <input type="search" placeholder="Recherche par mots clés" v-model="searchBarContent" v-on:keyup.enter="getSearchResult">
          <input type="button" class="btn btn-outline-success my-2 my-sm-0" v-on:click="getSearchResult" value="Rechercher"/>
        </form>

        <div  v-if="!userLogged">
          <router-link to="/register">S'inscrire</router-link>
          <router-link to='/login'>Se Connecter</router-link>
        </div>

        <template v-if="userLogged">
            <img src="" alt="">
            <span class="navbar-text"> <strong>{{authUserData.name}}</strong></span>
            <notification-component></notification-component>
            <button v-on:click="disconnectUser" class="btn btn-secondary">Logout</button>
        </template>

    </div> -->
    <div class="topBarCtnr">
        <div class="topBarContentBlock">

            <div class="rootLogoBlock">
                <router-link :to="{ path: '/' }">
                    <h1 class="title">Developeers</h1>
                </router-link>
            </div>

            <div class="searchBlock">
                <form>
                  <input type="search" class="searchBar" placeholder="Recherche par mots clés" v-model="searchBarContent" v-on:keyup.enter="getSearchResult">
                  <button type="button" class="btn btn-outline-success my-2 my-sm-0 searchBtn" v-on:click="getSearchResult"><i class="fa fa-search"></i></button>
                </form>
            </div>

            <div class="userBlock" v-if="!userLogged">
                <div class="userSubBlock">
                    <router-link to='/login'>Se Connecter</router-link>
                </div>
                <div class="userSubBlock">
                    <router-link to="/register">S'inscrire</router-link>
                </div>
            </div>

            <div class="userBlock" v-if="userLogged">
                <div class="userSubBlock">
                    <div class="profilePicCtnr">
                        <img src="@/assets/blank_profile_pic.png" alt="">
                    </div>
                    <router-link to="/profil"><strong>{{authUserData.name}}</strong></router-link>
                </div>
                <div class="userSubBlock">
                    <notification-component></notification-component>
                </div>
                <div class="userSubBlock">
                    <button v-on:click="disconnectUser" class="btn btn-secondary" title="Se déconnecter"> <i class="fas fa-power-off"></i> </button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import {
    mapState
} from 'vuex'
import NotificationComponent from '@/components/NotificationComponent.vue'

export default {
    data: function() {
        return {
            name: 'TopBarComponent',
            searchBarContent: ''
        }
    },
    computed: {
        ...mapState([
            'userLogged',
            'authUserData'
        ])
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

        if (this.$store.userLogged) {
            this.$store.dispatch('getSearchResult', this.searchBarContent)
            .then((response)=>{
                this.$router.push('/search/'+routeParamString);
            }, (error)=>{
                console.error(error);
            });
        }
        else {
            this.$store.dispatch('getGuestSearchResults', this.searchBarContent)
            .then((response)=>{
                this.$router.push('/search/'+routeParamString);
            }, (error)=>{
                console.error(error);
            });
        }
      }
    }
}
</script>

<style scoped>
.topBarCtnr {
    height: 5em;
    padding: 5px 30px;
    background-color: #2a2a2e;
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
    flex: 2;
}
.searchBar {
    width: 70%;
    padding: 5px;
}
.searchBtn {
}
.userSubBlock {
    flex:1;
    border-left: 1px solid #fff2;
    display: flex;
    justify-content: center;
    align-items: center;
}
.userSubBlock:last-child {
    border-right: 1px solid #fff2;
}
.profilePicCtnr {
    width: 50px;
    height: 50px;
    margin: 0 5px;
    overflow: hidden;
    border-radius: 3px;
}
.profilePicCtnr img {
    width: 100%;
    height: 100%;
}

.title {
    font-family: monospace;
}
</style>
