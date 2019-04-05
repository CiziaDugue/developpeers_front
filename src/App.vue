<template>
    <div class="container-fluid">
        <top-bar-component></top-bar-component>
        <dashboard-component></dashboard-component>
    </div>
</template>

<script>
// @ is an alias to /src
import DashboardComponent from '@/components/DashboardComponent.vue'
import TopBarComponent from '@/components/TopBarComponent.vue'
//
export default {
    components: {
        TopBarComponent,
        DashboardComponent
    }
}
</script>

<style>

</style>
