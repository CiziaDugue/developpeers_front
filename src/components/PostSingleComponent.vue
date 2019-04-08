<template>
<div class="container main-block">
    <div class="row">
        <div class="col-md-6 col-12">
            <h2 class="text-center">{{ postSingle.title }}</h2>
        </div>
        <div class="col-md-6 col-12">
            <small class="text-center">{{ postSingle.group_id }}</small>
        </div>
    </div>
    <div class="row">
        <div class="col-md-6 col-12">
            <h2 class="text-center">{{ postSingle.title }}</h2>
        </div>
        <div class="col-md-6 col-12">
            <small class="text-center">{{ postSingle.group_id }}</small>
        </div>
    </div>
    <div class="row">
        <table class="table table-hover table-dark">
            <tbody>
                <tr v-for="comment in postSingle.comments">
                    <th scope="row">{{ comment.created_at }}</th>
                    <td>{{ comment.created_at }}</td>
                    <td>{{ comment.created_at }}</td>
                    <td>@{{ comment.created_at }}</td>
                </tr>
            </tbody>
        </table>
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
            name: 'PostSingleComponent',
        }
    },
    computed: {
        ...mapState([
            'postSingle'
        ])
    },
    mounted: function() {
        this.$store.dispatch('initPostSingleAction', {
            postId: this.$route.params.postId
        })
    },
    // created: function() {
    //
    //     this.initializeList(this.$route.params.userId);
    // },
    // watch: {
    //     '$route': function(to, from) {
    //
    //         this.initializeList(to.params.userId);
    //     }
    // }
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
