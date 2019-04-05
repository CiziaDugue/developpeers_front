<template>
<div class="container-fluid">
    <sidebar-menu :menu="menu" />
    <router-view></router-view>
</div>
</template>

<script>
export default {
    data: function() {
        return {
            name: 'DashboardComponent',
            menu: [
                    {
                        header: true,
                        title: 'Menu',
                        // component: componentName
                        visibleOnCollapse: false
                    },
                    {
                        href: '/',
                        title: 'Dashboard',
                        icon: 'fa fa-user',
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
                        icon: 'fa fa-chart-area',
                        child: [
                            {
                                href: '/tous-les-groupes',
                                title: 'Tous les Groupes'
                            },
                            {
                                href: '/mes-groupes',
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
                        icon: 'fa fa-chart-area',
                        child: [
                            {
                                href: '/tous-les-articles',
                                title: 'Tous les Articles',
                            },
                            {
                                href: '/mes-articles',
                                title: 'Mes Articles',
                                badge: {
                                    text: '1',
                                    class: 'badge badge-light'
                                }
                            },
                            {
                                href: '/articles-suivis',
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
                        title: 'Profil',
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
    max-width: 20vw;
    height: 92vh;
    position: fixed;
    bottom: 0;
    top: 8vh;
}
/* vsm-dropdown {
    max-width: 50vw;
} */
</style>
