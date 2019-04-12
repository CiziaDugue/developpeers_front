<template>
<div class="container main-block">
    <h2 class="text-center">{{ title }}</h2>
    <form class="form_inline">
      <input type="search" placeholder="rechercher un groupe" v-model="searchGroupBarContent">
      <input type="button" value="Chercher" v-on:click="searchGroup">
    </form>
    <div class="card-columns">
        <div v-for="group in groupsList" v-bind:key="group._id" class="card p-3">
            <div class="card-body">
                <router-link :to="{ name: 'groupPostsList', params: {groupId: group._id } }">
                    <h3 class="card-title">{{ group.name }}</h3>
                </router-link>
                <p class="card-text">{{ group.description }}</p>
                <ul class="card-text">
                    <li v-for="keyword in group.keywords">{{ keyword }}</li>
                </ul>
                <button v-if="isUserInGroup(group.users_id, authUserData.id)" class="btn btn-outline-secondary btn-lg" v-on:click="leaveOrJoinGroup(group, 'leave')">Quitter</button>
                <button v-else class="btn btn-primary btn-lg" v-on:click="leaveOrJoinGroup(group, 'join')">Suivre</button>
                <p class="card-footer"><small class="text-muted">{{ group.updated_at }}</small></p>
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
            name: 'GroupsListComponent',
            searchGroupBarContent: ""
        }
    },
    computed: {
        ...mapState([
            'groupsList',
            'authUserData'
        ]),
        title: function() {
            let title = '';
            if (this.$route.params.groupsListType == 'tous-les-groupes') {
                title = 'Tous les Groupes';
            }
            else if (this.$route.params.groupsListType == 'mes-groupes') {
                title = 'Mes Groupes';
            }
            return title;
        }
    },
    methods: {
        initGroupsList: function(listType) {

            this.$store.dispatch('initGroupsListAction', listType);

        },

        isUserInGroup: function(groupUsers, userId) {

            return groupUsers.includes(userId);
        },

        leaveOrJoinGroup: function(group, action) {

            let payload = {
                type: this.$route.params.groupsListType,
                groupId: group._id,
                action: action,
            }

            this.$store.dispatch('leaveOrJoinGroupFromListAction', payload);
        },
        searchGroup: function() {
          let searchData = {
            words: this.searchGroupBarContent,
            emptySearchCallback: this.$route.params.groupsListType
          }
          this.$store.dispatch('getGroupSearchResult', searchData);
        },
        test: function(groupName) {
          console.log(groupName);
        }
    },
    created: function() {

        let listType = {
            type: this.$route.params.groupsListType
        }

        console.log('initializing ' + listType.type + ' groups list');

        this.initGroupsList(listType);
    },
    watch: {
        '$route': function(to, from) {

            let listType = {
                type: to.params.groupsListType
            }

            this.initGroupsList(listType);
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
