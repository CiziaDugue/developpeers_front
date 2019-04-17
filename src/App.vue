<template>
    <div id="app">
        <div id="topBarCtnr">
            <top-bar-component></top-bar-component>
        </div>
        <div id="dashboardCptCtnr">
            <dashboard-component></dashboard-component>
        </div>

    </div>
</template>

<script>
// @ is an alias to /src
import DashboardComponent from '@/components/DashboardComponent.vue'
import TopBarComponent from '@/components/TopBarComponent.vue'
//
export default {
    // data: function() {
    //     name: 'Home'
    // },
    components: {
        TopBarComponent,
        DashboardComponent
    }
}
</script>

<style>


</style>
