<template>
    <div>
        <button v-if="notifCount == 0" class="btn btn-secondary dropdown-toggle" type="button" aria-haspopup="true" aria-expanded="false" disabled>
            <i class="fas fa-bell"></i>
        </button>
        <div v-else class="dropdown">
            <div class="btn-group">

                <button type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-bell"></i>
                    <span class="badge badge-light ml-1" v-if="unreadNotifCount > 0">{{ unreadNotifCount }}</span>
                </button>

                <div class="dropdown-menu dropdown-menu-right">
                    <div class="clearNotifsLink" v-on:click="clearNotifs">Tout marquer comme lu</div>
                    <div
                        v-for="notif in this.unreadUserNotifs"
                        :key="notif._id"
                        class="unreadNotif notif dropdown-item"
                        v-on:click="validateNotification(notif._id, notif.post_id, notif.version_id)">
                        {{ notif.message }}
                        <div class="notifDate">
                            <small>Le {{ notif.created_at }}</small>

                        </div>
                    </div>

                    <router-link
                                v-for="notif in this.oldUserNotifs"
                                :key="notif._id"
                                class="oldNotif notif dropdown-item"
                                :to="{ name: 'notificatedPost', params: { postId: notif.post_id, versionId: notif.version.id }}">
                        {{ notif.message }}
                        <div class="notifDate">
                            <small> Le {{ notif.created_at }}</small>
                        </div>
                    </router-link>
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
        },

        validateNotification: function(notificationId, postId, versionId) {
            let payload = {
                notificationId: notificationId,
                postId: postId,
                versionId: versionId
            }
            this.$store.dispatch('testNotificationLink', payload)
            .then((response)=>{
                this.$router.push('/article/'+postId+'/'+versionId);
            }, (error) => {
                //console.error(error);//404
                this.$store.dispatch('deleteObsoleteNotification', notificationId)
                .then((response)=>{
                    this.getNotifications()
                    .then((response)=>{
                        this.$router.push('/oups');//router push '/' or errorCpt
                    }, (error)=>{
                        console.error(error);
                    });
                }, (error)=>{
                    console.error(error);
                });

            });
        },

        clearNotifs: function() {
            let payload = {
                notifs: []
            };
            this.unreadUserNotifs.forEach(function(notif) {
                payload.notifs.push({id: notif._id});
            });
            this.$store.dispatch('markAllNotificationsRead', payload)
            .then((response)=>{
                //console.log(response);
            }, (error)=>{
                console.error(error);
            });
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
    cursor: pointer;
}
.unreadNotif:hover {
    background-color: #7bc9;
}

.oldNotif {
    color: #888;
}

.dropdown-menu {
    max-height: 500px;
    overflow: auto;
    scrollbar-width: thin;
    box-shadow: 2px 2px 5px #0003;
}

.clearNotifsLink {
    color: #7bc;
    text-align: right;
    padding: 0 20px;
    cursor: pointer;
}

.clearNotifsLink:hover {
    text-decoration: underline;
    color: #5bf;
}

.notifDate {
    color: #a97;
}
</style>
