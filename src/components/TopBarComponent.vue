<template>
    <div class="container-fluid bg-secondary top-bar">
        <h1 class="title">Developeers</h1>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            name: 'TopBarComponent'
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top-bar {
    height: 8vh;
}
.title {
    font-family: monospace;
}
</style>
