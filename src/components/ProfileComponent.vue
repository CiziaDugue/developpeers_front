<template>
<main>
    <h2>Mon profil</h2>
    <div class="profile_pic">
        <img src="@/assets/blank_profile_pic.png" />
    </div>
    <div>
        <span>{{authUserData.name}}</span>
    </div>
</main>
</template>

<script>
import {
    mapState
} from 'vuex'


export default {
    data: function() {
        return {
            name: 'ProfileComponent',
            user: {}
        }
    },
    computed: {
        ...mapState([
            'authUserData'
        ])
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
    }
}
</script>

<style scoped>
main {
    position: relative;
    left: 50px;
    top: 100px;
    max-width: 1200px;
    margin: 0 auto;
    border: 1px solid #eee;
}

.profile_pic {
    width: 100px;

}

.profile_pic img {
    width: 100%;
}
</style>
