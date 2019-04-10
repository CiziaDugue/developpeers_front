<template>
  <main class="main-container">
    <h1>Home</h1>
    <div v-for="post in postsFeed" v-bind:key="post._id" v-if="userLogged">
      <span>{{post.title}}</span>
    </div>
  </main>
</template>

<script>
import {mapState} from 'vuex'

  export default {
    data: function() {
      return {

      }
    },
    computed: {
      ...mapState([
        'postsFeed',
        'userLogged'
      ])
    },
    methods: {
      getPostsFeed: function() {
        this.$store.dispatch('getPostsFeed');
      }
    },
    created: function() {
        this.getPostsFeed();
    }
  }
</script>

<style scoped>
main {
  position: relative;
  left: 50px;
  top: 8vh;
  border: 1px solid #eee;
}
</style>
