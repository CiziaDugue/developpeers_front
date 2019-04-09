<template>
    <div class="bg-secondary top-bar fixed-top navbar navbar-expand-lg">
        <router-link :to="{ path: '/' }">
            <h1 class="title">Developeers</h1>
        </router-link>
        <!-- <router-link :to="{ name: 'postSingle', params: { postId: '5ca9db30e075042c16576462' }}">
            <h3 class="card-title">5ca9db30e075042c16576462</h3>
        </router-link> -->
        <!-- <button class="btn btn-light btn-inline">Log Out</button> -->
        <router-link to='/login' v-if="this.$store.state.userLogged == false">Login</router-link>
        <button v-if="this.$store.state.userLogged == true" v-on:click="disconnectUser" class="btn btn-secondary">Logout</button>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            name: 'TopBarComponent'
        }
    },
    methods: {
      disconnectUser: function() {
        this.$store.dispatch('disconnectUser');
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
}
.title {
    font-family: monospace;
}
</style>
