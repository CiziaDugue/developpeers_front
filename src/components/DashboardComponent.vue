<template>
<div id="dashboard-container">
    <div id="sideBarCtnr">
        <sidebar-menu :menu="menu" :collapsed="false" v-if="this.$store.state.userLogged == true"/>
    </div>
    <div id="routerViewCtnr">
        <router-view></router-view>
    </div>
</div>
</template>

<script>
// import {mapState} from 'vuex'

export default {
    data: function() {
        return {
            name: 'DashboardComponent',
            // theme: 'white-theme',
            menu: [
                {
                    href: '/',
                    title: 'Dashboard',
                    icon: 'fa fa-chart-area',
                },
                {
                    title: 'Groupes',
                    icon: 'fas fa-users',
                    child: [{
                            href: '/groupes/tous-les-groupes',
                            title: 'Tous les Groupes'
                        },
                        {
                            href: '/groupes/mes-groupes',
                            title: 'Mes Groupes',
                        },
                        {
                            href: '/creer-un-groupe',
                            title: 'Créer un Groupe',
                        }
                    ]
                },
                {
                    title: 'Articles',
                    icon: 'far fa-file-alt',
                    child: [
                        // {
                        //     href: '/articles/tous-les-articles',
                        //     title: 'Tous les Articles',
                        //
                        // },
                        {
                            href: '/articles/mes-articles',
                            title: 'Mes Articles',
                        },
                        {
                            href: '/articles/articles-suivis',
                            title: 'Articles suivis',
                        },
                        {
                            href: '/creer-un-article',
                            title: 'Créer un Article',
                        }

                    ]
                },
                {
                    href: '/profil',
                    title: 'Mon Profil',
                    icon: 'fa fa-user'
                }

            ]
        }
    },
    methods: {
        getNotifications: function() {
            if (this.$store.userLogged) this.$store.dispatch('getNotificationsAction');
            //console.log(this.$store.state.headerObject);
        },
    },
    created: function() {
        this.getNotifications();
    }
}
</script>

<style scoped>
.v-sidebar-menu {
    height: calc(100vh - 5em);
    position: relative;
    /* box-shadow: 0 5px 5px black; */
}

@media (min-width: 640px) {
    .v-sidebar-menu {
        max-width: 15vw;
    }
}


/* vsm-dropdown {
    max-width: 50vw;
} */
</style>
