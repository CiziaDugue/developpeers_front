<template>
<div class="dropdown">
    <div class="btn-group square-btn m-0 p-0">
        <small class="square-btn bg-warning text-center pt-1 notif-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" :class="{'cursor':notifCount}">
            <i class="fas fa-bell"></i>
            <span class="badge badge-light ml-1 notif-badge" v-if="unreadNotifCount > 0">{{ unreadNotifCount }}</span>
        </small>
        <div class="dropdown-menu dropdown-menu-right rounded-0">
            <div class="clearNotifsLink" v-on:click="clearNotifs">Tout marquer comme lu</div>
            <div v-for="notif in this.unreadUserNotifs" :key="notif._id" class="unreadNotif notif dropdown-item" v-on:click="validateNotification(notif._id, notif.post_id, notif.version.id, notif.request_route_link, notif.origin_element_id)">
                {{ notif.message }}
                <div class="notifDate">
                    <small>Le {{ notif.created_at }}</small>
                </div>
            </div>
            <!-- <router-link v-for="notif in this.oldUserNotifs" :key="notif._id" class="oldNotif notif dropdown-item" :to="{ name: 'notificatedPost', params: { postId: notif.post_id, versionId: notif.version.id }}">
                {{ notif.message }}
                <div class="notifDate">
                    <small> Le {{ notif.created_at }}</small>
                </div>
            </router-link> -->
            <div v-for="notif in this.oldUserNotifs" :key="notif._id" class="oldNotif notif dropdown-item" v-on:click="validateNotification(notif._id, notif.post_id, notif.version.id, notif.request_route_link, notif.origin_element_id)">
                {{ notif.message }}
                <div class="notifDate">
                    <small>Le {{ notif.created_at }}</small>
                </div>
            </div>
        </div>

    </div>
</div>
</template>

<script>
import {
    mapState
} from 'vuex'

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
                if (notif.unread) count++;
            });
            return count;
        }
    },
    methods: {
        getNotifications: function() {
            this.$store.dispatch('getNotificationsAction');
        },

        validateNotification: function(notificationId, postId, versionId, link, originElementId) {
            let payload = {
                notificationId: notificationId,
                postId: postId,
                versionId: versionId,
                link: link,
                originElementId: originElementId
            };
            this.$store.dispatch('testNotificationLink', payload)
                    .then((response) => {
                        if (typeof originElementId == 'number') {
                            this.$router.push(link);
                        } else {
                            this.$router.push('/article/' + postId + '/' + versionId);
                        }
                }, (error) => {
                    //console.error(error);//404
                    this.$store.dispatch('deleteObsoleteNotification', notificationId)
                            .then((response) => {
                                this.getNotifications()
                                    .then((response) => {
                                        this.$router.push('/oups'); //router push '/' or errorCpt
                                    }, (error) => {
                                        console.error(error);
                                    });
                        }, (error) => {
                            console.error(error);
                        });

                });
        },

        clearNotifs: function() {
            let payload = {
                notifs: []
            };
            this.unreadUserNotifs.forEach(function(notif) {
                payload.notifs.push({
                    id: notif._id
                });
            });
            this.$store.dispatch('markAllNotificationsRead', payload)
                .then((response) => {
                    //console.log(response);
                }, (error) => {
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
.notif-btn {
    position: relative;
}
.notif-badge {
    position: absolute;
    left: 12px;
    bottom: 1px;
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
    /* box-shadow: 2px 2px 5px #0003; */
}

@media (max-width: 800px) {
    .dropdown-menu {
        max-width: 96vw;
    }
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
