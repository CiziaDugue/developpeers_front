<template>
<div class="main-block">
    <div class="row align-items-center justify-content-center p-2">
        <div class="col-8">
            <h2 class="text-center">{{ title }}</h2>
        </div>
        <div class="col-4 p-2">
            <div class="input-group input-group-sm">
                <input type="search" class="form-control searchBar w-50 rounded-0" placeholder="Rechercher un groupe" v-model="searchGroupBarContent" v-on:keyup.enter="searchGroup">
                <div class="input-group-append">
                    <button type="button" class="btn btn-outline-primary my-2 my-sm-0 rounded-0" v-on:click="searchGroup"><i class="fa fa-search"></i></button>
                </div>
            </div>
        </div>
    </div>

    <div>
        <div v-for="group in groupsList" v-bind:key="group._id" class="card p-2 bg-light rounded-0">
            <div class="card-body">
                <div class="row">
                    <div class="col-8">
                        <div class="row">
                            <div class="col-12">
                                <router-link :to="{ name: 'groupPostsList', params: {groupId: group._id } }">
                                    <h3 class="card-title">{{ group.name }}</h3>
                                </router-link>
                            </div>
                            <div class="col-12">
                                <p>{{ group.description }}</p>
                            </div>
                            <div class="col-12">
                                <p>{{ group.users.length }} membres - {{ group.number_of_posts }} articles</p>
                            </div>
                            <div class="col-12">
                                <p class="card-text text-center"><small class="text-muted">Créé le {{ group.created_at }}</small></p>
                            </div>
                        </div>
                    </div>
                    <div class="col-3 align-self-center">
                        <ul class="card-text list-group list-group-flush">
                            <li class="list-group-item font-weight-light font-italic border-0" v-for="keyword in group.keywords">{{ keyword }}</li>
                        </ul>
                    </div>
                    <div class="col-1 align-self-center">
                        <button v-if="isUserInGroup(group.users_id, authUserData.id)" class="btn btn-outline-secondary rounded-0" v-on:click="leaveOrJoinGroup(group, 'leave')" data-toggle="tooltip" data-placement="up" title="Quitter le groupe?">
                            <i class="fas fa-sign-out-alt"></i>
                        </button>
                        <button v-else class="btn btn-secondary rounded-0" v-on:click="leaveOrJoinGroup(group, 'join')" data-toggle="tooltip" data-placement="up" title="Rejoindre le groupe?">
                            <i class="fas fa-sign-in-alt"></i>
                        </button>
                    </div>
                </div>
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
