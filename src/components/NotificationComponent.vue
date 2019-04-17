<template>
    <div>
        <button v-if="notifCount == 0" class="btn btn-secondary dropdown-toggle" type="button" aria-haspopup="true" aria-expanded="false" disabled>
            <i class="fas fa-bell"></i>
        </button>
        <div v-else class="dropdown">
            <!-- <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-bell"></i>
                <span class="badge badge-light ml-1" v-if="unreadNotifCount > 0">{{ unreadNotifCount }}</span>
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                 <button v-for="notif in this.unreadUserNotifs" class="dropdown-item" type="button">
                     <router-link class="dropdown-item" :to="{ name: 'notificatedPost', params: { postId: notif.post_id, versionId: notif.version.id }}">
                         {{ notif.message }}
                     </router-link>
                 </button>
            </div> -->
            <div class="btn-group">
                <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-bell"></i>
                    <span class="badge badge-light ml-1" v-if="unreadNotifCount > 0">{{ unreadNotifCount }}</span>
                </button>
                <div class="dropdown-menu notifMenu">
                    <!-- <div class="unreadNotif dropdown-item" v-for="notif in this.unreadUserNotifs"> -->
                        <router-link
                                    v-for="notif in this.unreadUserNotifs"
                                    class="unreadNotif notif dropdown-item"
                                    :to="{ name: 'notificatedPost', params: { postId: notif.post_id, versionId: notif.version.id }}">
                            {{ notif.message }}
                        </router-link>
                    <!-- </div> -->
                    <!-- <div class="oldNotif notif dropdown-item" v-for="notif in this.oldUserNotifs"> -->
                        <router-link
                                    v-for="notif in this.oldUserNotifs"
                                    class="oldNotif notif dropdown-item"
                                    :to="{ name: 'notificatedPost', params: { postId: notif.post_id, versionId: notif.version.id }}">
                            {{ notif.message }}
                        </router-link>
                    <!-- </div> -->
                </div>
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
            'userNotifs',
        ]),

        notifCount: function() {
            return this.userNotifs.length;
        },

        unreadUserNotifs: function() {
            let notifs = [];
            this.userNotifs.forEach(function(notif) {
                if (notif.unread) {
                    notifs.push(notif);
                }
            });
            return notifs.reverse();
        },

        oldUserNotifs: function() {
            let notifs = [];
            this.userNotifs.forEach(function(notif) {
                if (!notif.unread) {
                    notifs.push(notif);
                }
            });
            return notifs.reverse();
        },

        unreadNotifCount: function() {
            let count = 0;
            this.userNotifs.forEach(function(notif) {
                if (notif.unread) count ++;
            });
            return count;
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

.notif {
    padding: 16px 21px;
}

.unreadNotif {
    background-color: #7bc3;
    color: #444;
    font-weight: bold;
}
.unreadNotif:hover {
    background-color: #7bc9;
}

.oldNotif {
    color: #888;
}

.notifMenu {
    max-height: 500px;
    overflow: auto;
    scrollbar-width: thin;
    box-shadow: 2px 2px 5px #0003;
    position: relative;
    right: 300px;
}
</style>
