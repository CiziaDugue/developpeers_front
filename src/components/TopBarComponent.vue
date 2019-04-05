<template>
    <div class="bg-secondary top-bar">
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
    width: 100vw;
    height: 8vh;
    margin: 0;
    padding: 5px 0;
}
.title {
    font-family: monospace;
}
</style>
