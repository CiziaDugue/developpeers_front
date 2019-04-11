<template>
<div class="container main-block">
    <h2 class="text-center">{{ title }}</h2>
    <div class="card-columns">
        <div v-for="post in postsList" v-bind:key="post._id" class="card p-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-8">
                        <router-link :to="{ name: 'postSingle', params: { postId: post._id }}">
                            <h3 class="card-title">{{ post.title }}</h3>
                        </router-link>
                    </div>
                    <div class="col-4">
                        <button class="fas fa-angle-up" v-on:click="votePost(post, 'post', true)"></button>
                        <small class="badge badge-pill badge-success">{{ post.votePros }}</small>
                        <small class="badge badge-pill badge-danger">{{ post.voteCons }}</small>
                        <button class="fas fa-angle-down" v-on:click="votePost(post, 'post', false)"></button>
                    </div>
                </div>
                <ul class="card-text">
                    <li v-for="keyword in post.keywords">{{ keyword }}</li>
                </ul>
                <p class="card-text"><small class="text-muted">{{ post.updated_at }}</small></p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    data: function() {
        return {
            name: 'PostsListComponent',
        }
    },
    computed: {
        ...mapState([
            'postsList'
        ]),

        title: function() {
            let title = '';
            if (this.$route.params.postsListType == 'tous-les-articles') {
                title = 'Tous les Articles';
            }
            else if (this.$route.params.postsListType == 'mes-articles') {
                title = 'Mes Articles';
            }
            else if (this.$route.params.postsListType == 'articles-suivis') {
                title = 'Mes Articles Suivis';
            } else if (this.$route.params.groupId) {
              title = "Groupe";//Temporaire
            }
            return title;
        }
    },
    methods: {
        initPostsList: function(data) {

            this.$store.dispatch('initPostsListAction', data);

        },

        votePost: function(target, type, vote) {

            let payload = {
                type: type,
                vote: vote,
                target: target,
                urlParam: this.$route.params.postsListType
            }

            this.$store.dispatch('voteAction', payload);
        }
    },
    created: function() {

        let listType = (this.$route.params.groupId) ? {type:"group-posts"} : {type: this.$route.params.postsListType};

        console.log('initializing ' + listType.type + ' posts list');

        let groupId = (this.$route.params.groupId) ? this.$route.params.groupId : null;

        let data = {
          groupId: groupId,
          listType: listType
        }

        this.initPostsList(data);
    },
    watch: {
        '$route': function(to, from) {

            // let listType = {
            //     type: to.params.postsListType /*? to.params.postsListType : to.params.groupId*/
            // }
            let listType = (to.params.groupId) ? {type:"group-posts"} : {type: to.params.postsListType};
            let groupId = (to.params.groupId) ? to.params.groupId : null;

            let data = {
              groupId: groupId,
              listType: listType
            }

            this.initPostsList(data);
        }
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
