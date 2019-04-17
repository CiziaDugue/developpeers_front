<template>
<div class="top-bar fixed-top navbar navbar-dark navbar-expand-lg">
    <router-link :to="{ path: '/' }">
        <h1 class="title">Developeers</h1>
    </router-link>
    <!-- <router-link :to="{ name: 'postSingle', params: { postId: '5ca9db30e075042c16576462' }}">
            <h3 class="card-title">5ca9db30e075042c16576462</h3>
        </router-link> -->
    <!-- <button class="btn btn-light btn-inline">Log Out</button> -->
    <form class="form-inline">
        <input type="search" placeholder="Recherche par mots clés" v-model="searchBarContent">
        <input type="button" class="btn btn-outline-success my-2 my-sm-0" v-on:click="getSearchResult" value="Rechercher" />
    </form>

    <notification-component v-if="this.$store.state.userLogged == true"></notification-component>

    <div v-if="this.$store.state.userLogged == false">
        <router-link to="/register">Créer mon compte</router-link>
        <router-link to='/login'>Se Connecter</router-link>
    </div>
    <button v-if="this.$store.state.userLogged == true" v-on:click="disconnectUser" class="btn btn-secondary">Logout</button>
</div>
</template>

<script>
// import {mapState} from 'vuex'
import NotificationComponent from '@/components/NotificationComponent.vue'

export default {
    data: function() {
        return {
            name: 'TopBarComponent',
            searchBarContent: ''
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
        getSearchResult: function() {
            if (this.$store.userLogged) this.$store.dispatch('getSearchResult', this.searchBarContent);
            else this.$store.dispatch('getGuestSearchResults', this.searchBarContent);
            this.$router.push('/');
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
