<template>
    <div>
        <button v-if="notifCount == 0" class="btn btn-secondary dropdown-toggle" type="button" aria-haspopup="true" aria-expanded="false" disabled>
            <i class="fas fa-bell"></i>
        </button>
        <div v-else class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-bell"></i>
                <span class="badge badge-light ml-1">{{ notifCount }}</span>
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                 <button v-for="notif in this.userNotifs" class="dropdown-item" type="button">
                     <router-link class="dropdown-item" :to="{ name: 'notificatedPost', params: { postId: notif.post_id, versionId: notif.version.id }}">{{ notif.message }}</router-link>
                 </button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
    data: function() {
        return {
            name: 'NotificationComponent',
        }
    },
    computed: {
        ...mapState([
            'userNotifs'
        ]),
        notifCount: function() {
            return this.$store.state.userNotifs.length;
        }
    },
    methods: {
        getNotifications: function() {
            this.$store.dispatch('getNotificationsAction');
            // console.log(this.$store.state.userNotifs);
            // console.log(this.userNotifs);
        }
    },
    created: function() {
        this.getNotifications();
    },
    // watch: {
    //     'userNotifs': function() {
    //
    //         this.getNotifications();
    //     }
    // }
}
</script>

<style scoped>

</style>
