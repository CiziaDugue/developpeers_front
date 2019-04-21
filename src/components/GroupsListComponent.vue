<template>
<div class="main-block">
    <div class="row justify-content-center align-items-center">
        <div class="col-sm-9 col-12 card-bg2 p-5">
            <h2 class="text-center">{{ title }}</h2>
        </div>
        <div class="col-sm-3 col-12 p-5 card-bg1 align-self-stretch">
            <div class="input-group input-group-sm">
                <input type="search" class="form-control searchBar w-50 rounded-0" placeholder="Rechercher un groupe" v-model="searchGroupBarContent" v-on:keyup.enter="searchGroup">
                <!-- <div class="input-group-append">
                    <button type="button" class="btn btn-outline-primary my-2 my-sm-0 rounded-0" v-on:click="searchGroup"><i class="fa fa-search"></i></button>
                </div> -->
            </div>
        </div>
    </div>

    <div>
        <div v-for="(group, key, index) in groupsList" v-bind:key="group._id" class="card p-0 m-0 rounded-0">
            <div class="card-body p-0 m-0">
                <div class="row">
                    <!-- <div class="col-sm-1 col-2">
                    </div> -->
                    <div class="col-sm-9 col-12 p-4" :class="bg1(key)">
                        <div class="row">
                            <div class="col-12">
                                <router-link :to="{ name: 'groupPostsList', params: {groupId: group._id } }">
                                    <h3 class="card-title">{{ group.name }}</h3>
                                </router-link>
                            </div>
                            <div class="col-12">
                                <p :class="textColor1(key)">{{ group.description }}</p>
                            </div>
                            <div class="col-12">
                                <p :class="textColor1(key)">{{ group.users.length }} Membres - {{ group.number_of_posts }} Articles</p>
                            </div>
                            <div class="col-12">
                                <p class="footer-text"  :class="textColor1(key)">Créé le {{ group.created_at }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-2 col-8 align-self-stretch" v-bind:class="bg2(key)">
                        <ul class="card-text list-group list-group-flush py-4">
                            <li class="list-group-item font-weight-light font-italic border-0 bg-transparent" :class="textColor2(key)" v-for="keyword in group.keywords">{{ keyword }}</li>
                        </ul>
                    </div>
                    <div class="col-sm-1 col-4 d-flex flex-column align-items-end" v-bind:class="bg2(key)">
                        <small v-if="isUserInGroup(group.users_id, authUserData.id)" class="cursor square-btn bg-info text-center pt-1" v-on:click="leaveOrJoinGroup(group, 'leave')" data-toggle="tooltip" data-placement="up" title="Quitter le groupe?">
                            <!-- <i class="far fa-eye-slash"></i> -->
                            <i class="fas fa-bookmark"></i>
                        </small>
                        <small v-else class="cursor square-btn bg-secondary text-center pt-1" v-on:click="leaveOrJoinGroup(group, 'join')" data-toggle="tooltip" data-placement="up" title="Rejoindre le groupe?">
                            <!-- <i class="far fa-eye"></i> -->
                            <i class="far fa-bookmark"></i>
                        </small>
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
        bg1: function(key) {
            if (key % 2 == 0) {
                return 'card-bg1';
            } else return 'card-bg2';
        },
        bg2: function(key) {
            if (key % 2 == 0) {
                return 'card-bg2';
            } else return 'card-bg1';
        },
        textColor1: function(key) {
            if (key % 2 == 0) {
                return 'card-text2';
            } else return 'card-text1';
        },
        textColor2: function(key) {
            if (key % 2 == 0) {
                return 'card-text1';
            } else return 'card-text2';
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
.card-bg1 {
    /* background-color: #8baed3; */
    background-color: #c3d1dd;
}

.card-bg2 {
    background-color: #fff;
    /* background-color: #c3d1dd; */
}
.card-text1 {
    color: #57515b;
}

.card-text2 {
    color: #57515b;
    /* color: #fff; */
}
</style>
