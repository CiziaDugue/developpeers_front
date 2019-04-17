<template>
<div class="dashboard-container">
    <sidebar-menu :menu="menu" :collapsed="true" v-if="this.$store.state.userLogged == true"/>
    <router-view></router-view>
</div>
</template>

<script>
// import {mapState} from 'vuex'

export default {
    data: function() {
        return {
            name: 'DashboardComponent',
            // theme: 'white-theme',
            menu: [{
                    header: true,
                    title: 'Menu',
                    // component: componentName
                    visibleOnCollapse: false
                },
                {
                    href: '/',
                    title: 'Dashboard',
                    icon: 'fa fa-chart-area',
                    /*
                    disabled: true
                    badge: {
                        text: 'new',
                        // class:''
                    }
                    */
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
                            // badge: {
                            //     text: '1',
                            //     class: 'badge badge-light'
                            // }
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
                            // badge: {
                            //     text: '1',
                            //     class: 'badge badge-light'
                            // }
                        },
                        {
                            href: '/articles/articles-suivis',
                            title: 'Articles suivis',
                            // badge: {
                            //     text: '1',
                            //     class: 'badge badge-light'
                            // }
                        },
                        {
                            href: '/creer-un-article',
                            title: 'Créer un Article',
                        }

                    ]
                },
                // {
                //     title: 'Notifications',
                //     icon: 'fas fa-bell',
                //     badge: {
                //         text: 1,
                //         class: 'badge badge-light'
                //     }
                // },
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-sidebar-menu {
    height: 92vh;
    /* position: fixed; */
    bottom: 0;
    top: 8vh;
}

@media (min-width: 640px) {
    .v-sidebar-menu {
        max-width: 20vw;
    }
}

/* vsm-dropdown {
    max-width: 50vw;
} */
</style>
