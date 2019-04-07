<template>
<div class="container main-block">
    <h2 class="text-center">{{ title }}</h2>
    <div class="card-columns">
        <div v-for="group in groupsList" v-bind:key="group._id" class="card p-3">
            <div class="card-body">
                <h3 class="card-title">{{ group.name }}</h3>
                <p class="card-text">{{ group.description }}</p>
                <ul class="card-text">
                    <li v-for="keyword in group.keywords">{{ keyword }}</li>
                </ul>
                <p class="card-text"><small class="text-muted">{{ group.updated_at }}</small></p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
const axios = require('axios');
import {
    mapState
} from 'vuex'

export default {
    data: function() {
        return {
            name: 'GroupsListComponent',
            title: 'Tous les Groupes',
        }
    },
    computed: {
        ...mapState([
            'groupsList'
        ])
    },
    mounted: function() {
        this.$store.dispatch('initGroupsListAction')
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main-block {
    position: relative;
    right: 0;
    top: 8vh;
}
</style>
