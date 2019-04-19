<template>
<div class="main-block">
    <div class="row align-items-center justify-content-center border-bottom mb-2 pb-2 pt-2">
        <div class="col-8">
            <h2 class="text-center">{{ title }}</h2>
        </div>
        <div class="col-4">
            <div class="input-group input-group-sm">
                <input type="search" class="form-control searchBar w-50" placeholder="Rechercher un groupe" v-model="searchGroupBarContent" v-on:keyup.enter="searchGroup">
                <div class="input-group-append">
                    <button type="button" class="btn btn-outline-primary my-2 my-sm-0" v-on:click="searchGroup"><i class="fa fa-search"></i></button>
                </div>
            </div>
        </div>
    </div>

    <div>
        <div v-for="group in groupsList" v-bind:key="group._id" class="card p-2 mb-2 bg-light shadow-sm">
            <div class="card-body">
                <div class="row">
                    <div class="col-6">
                        <div class="row">
                            <div class="col-12 align-self-start">
                                <router-link :to="{ name: 'groupPostsList', params: {groupId: group._id } }">
                                    <h3 class="card-title">{{ group.name }}</h3>
                                </router-link>
                            </div>
                            <div class="col-12 align-self-center">
                                <p class="card-text">{{ group.description }}</p>
                            </div>
                            <div class="col-12 align-self-end">
                                <p class="text-center">{{ group.users.length }} membres - xxx articles</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-4 align-self-center">
                        <ul class="card-text list-group list-group-flush">
                            <li class="list-group-item font-weight-light font-italic border-0" v-for="keyword in group.keywords">{{ keyword }}</li>
                        </ul>
                    </div>
                    <div class="col-2 align-self-center">
                        <button v-if="isUserInGroup(group.users_id, authUserData.id)" class="btn btn-outline-secondary btn-lg" v-on:click="leaveOrJoinGroup(group, 'leave')">Quitter le groupe</button>
                        <button v-else class="btn btn-secondary btn-lg" v-on:click="leaveOrJoinGroup(group, 'join')">Suivre le groupe</button>
                    </div>
                </div>

                <!-- <p class="card-footer"><small class="text-muted">{{ group.updated_at }}</small></p> -->
            </div>
        </div>
    </div>
</div>
</template>

<script>
import {
    mapState
} from 'vuex'

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
            'authUserData',
            'userLogged'
        ]),
        title: function() {
            let title = '';
            if (this.$route.params.groupsListType == 'tous-les-groupes') {
                title = 'Tous les Groupes';
            } else if (this.$route.params.groupsListType == 'mes-groupes') {
                title = 'Mes Groupes';
            }
            return title;
        }
    },
    methods: {
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
        getNotifications: function() {
            if (this.$store.userLogged) {
                this.$store.dispatch('getNotificationsAction');
            }
        },
        initGroupsList: function(listType) {
            this.$store.dispatch('initGroupsListAction', listType);
        },
        init: function() {
            let listType = {
                type: this.$route.params.groupsListType
            }
            console.log('Initializing ' + listType.type + ' groups list');
            this.initGroupsList(listType);
            this.getNotifications();
        }
    },
    created: function() {
        if (!this.userLogged) {
            this.$store.dispatch('autoLogin')
                        .then((response)=>{
                            this.init();
                        }, (error)=>{
                            console.error(error);
                            this.$router.push('/login');
                        });
        } else {
            this.init();
        }
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
    /* position: relative;
    right: 0;
    top: 8vh; */
}
</style>
