<template>
    <div class="top-bar fixed-top navbar navbar-dark navbar-expand-lg">
        <router-link :to="{ path: '/' }">
            <h1 class="title">Developeers</h1>
        </router-link>
        <form class="form-inline">
          <input type="search" placeholder="Recherche par mots clés" v-model="searchBarContent" v-on:keyup.enter="getSearchResult">
          <input type="button" class="btn btn-outline-success my-2 my-sm-0" v-on:click="getSearchResult" value="Rechercher"/>
        </form>
        <div  v-if="!userLogged">
          <router-link to="/register">Créer mon compte</router-link>
          <router-link to='/login'>Se Connecter</router-link>
        </div>

        <div v-if="userLogged">
            <img src="" alt="">
            <span class="navbar-text"> <strong>{{authUserData.name}}</strong></span>
            <button v-if="userLogged" v-on:click="disconnectUser" class="btn btn-secondary">Logout</button>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'

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
    methods: {
      disconnectUser: function() {
        this.$store.dispatch('disconnectUser');
        this.$router.push('/');
      },
      getSearchResult: function() {
        if (this.$store.userLogged) {
            this.$store.dispatch('getSearchResult', this.searchBarContent)
            .then((response)=>{
                this.$router.push('/');
            }, (error)=>{
                console.error(error);
            });
        }
        else {
            this.$store.dispatch('getGuestSearchResults', this.searchBarContent)
            .then((response)=>{
                this.$router.push('/');
            }, (error)=>{
                console.error(error);
            });
        }
      }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top-bar {
    width: 100vw;
    height: 8vh;
    margin: 0;
    padding: 5px 0;
    background-color: #2a2a2e;
}
.title {
    font-family: monospace;
}
</style>
