<template>
  <main>
      <h2>Mon profil</h2>
  </main>
</template>

<script>
  export default {
    data: function() {
      return {
        name: 'ProfileComponent',
        user: {}
      }
    }
  }
</script>

<style scoped>
main {
    position: relative;
    right: 0;
    top: 200px;
    width: 1000px;
    margin: 0 auto;
}
</style>
