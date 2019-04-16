<template>
<div class="container main-block">
    <h2 class="text-center">{{ title }}</h2>

    <button v-if="isGroupList == true" class="fas fa-angle-left" v-on:click="goBack()"></button>
    <button v-if="isGroupList == true && isUserInGroup == true" class="btn btn-outline-secondary btn-lg" v-on:click="leaveOrJoinGroup('leave')">Quitter</button>
    <button v-else-if="isGroupList == true && isUserInGroup == false" class="btn btn-primary btn-lg" v-on:click="leaveOrJoinGroup('join')">Suivre</button>

    <div v-if="isGroupList">
      <div>
        Dans ce groupe on parle de :
        <ul>
          <li v-for="word in groupSingle.keywords">{{word}}</li>
        </ul>
      </div>
      <button class="btn btn-success" v-on:click="createPost">Créer un article</button>
    </div>

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
            inGroup: false
        }
    },
    computed: {
        ...mapState([
            'postsList',
            'groupSingle',
            'userLogged'
        ]),

        title: function() {
            let title = '';
            if (this.$route.params.postsListType == 'tous-les-articles') {
                title = 'Tous les Articles';
            } else if (this.$route.params.postsListType == 'mes-articles') {
                title = 'Mes Articles';
            } else if (this.$route.params.postsListType == 'articles-suivis') {
                title = 'Mes Articles Suivis';
            } else if (this.$route.params.groupId) {
              title = this.groupSingle.name;
            }
            return title;
        },

        isGroupList: function() {
            let response = this.$route.params.groupId ? true : false;
            //console.log('isGroupList = ' + response);
            return response;
            // return this.$route.params.groupId ? true : false;
        },

        isUserInGroup: function() {
            return this.groupSingle.users_id.includes(this.$store.state.authUserData.id);
        }
    },
    methods: {
        initPostsList: function(data) {
            this.$store.dispatch('initPostsListAction', data);
        },

        votePost: function(target, type, vote) {

            let listType = this.$route.params.postsListType ? this.$route.params.postsListType : null;
            let groupId = this.$route.params.groupId ? this.$route.params.groupId : null;

            let payload = {
                type: type,
                vote: vote,
                target: target,
                listType: listType,
                groupId: groupId
            };

            this.$store.dispatch('voteInPostListAction', payload);
        },

        goBack: function() {

            this.$router.go(-1);
        },

        leaveOrJoinGroup: function(action) {

            console.log('leaveMeth = '+this.$route.params.groupId);

            let payload = {
                listType: 'group-posts',
                groupId: this.$route.params.groupId,
                action: action
            }

            this.$store.dispatch('leaveOrJoinGroupFromGroupAction', payload);
        },

        createPost: function() {
          this.$router.push('/creer-un-article/'+this.groupSingle._id);
        }
    },
    created: function() {
        if (!this.userLogged) this.$router.push('/login');
        else {
            let listType = (this.$route.params.groupId) ? "group-posts" : this.$route.params.postsListType;

            console.log('Initializing ' + listType + ' posts list');

            let groupId = (this.$route.params.groupId) ? this.$route.params.groupId : null;

            let data = {
                groupId: groupId,
                listType: listType
            };
            this.initPostsList(data);
        }
    },
    watch: {
        '$route': function(to, from) {

            let listType = (to.params.groupId) ? "group-posts" : to.params.postsListType;
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
