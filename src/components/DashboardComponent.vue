<template>
<div class="container-fluid">
    <sidebar-menu :menu="menu" :collapsed="true" v-if="this.$store.state.userLogged == true"/>
    <router-view></router-view>
</div>
</template>

<script>
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
                            badge: {
                                text: '1',
                                class: 'badge badge-light'
                            }
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
                    child: [{
                            href: '/articles/tous-les-articles',
                            title: 'Tous les Articles',

                        },
                        {
                            href: '/articles/mes-articles',
                            title: 'Mes Articles',
                            badge: {
                                text: '1',
                                class: 'badge badge-light'
                            }
                        },
                        {
                            href: '/articles/articles-suivis',
                            title: 'Articles suivis',
                            badge: {
                                text: '1',
                                class: 'badge badge-light'
                            }
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
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.v-sidebar-menu {
    height: 92vh;
    position: fixed;
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
