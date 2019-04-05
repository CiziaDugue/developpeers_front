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
                        title: 'Main Navigation',
                        // component: componentName
                        // visibleOnCollapse: true
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
                        title: 'Articles',
                        icon: 'fa fa-chart-area',
                        child: [
                            {
                                href: '/mes-articles',
                                title: 'Mes Articles',
                            }
                        ]
                    }
                ]
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
