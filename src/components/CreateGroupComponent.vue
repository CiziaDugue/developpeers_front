<template>
<main>
    <div class="row align-items-center justify-content-center">
        <div class="col-sm-9 col-12 card-bg1 p-5">
            <h2 class="text-center">Nouveau Groupe</h2>
        </div>
        <div class="col-sm-3 col-12 card-bg2 align-self-stretch">

        </div>
    </div>
    <form>
        <h2>Céer un groupe</h2>
        <div class="alert alert-danger" v-if="invalidData">
            Tous les champs doivent être remplis.
        </div>
        <div class="form-group">
            <label>Nom</label>
            <input type="text" name="name" placeholder="Nom du groupe" class="form-control rounded-0" v-model="name">
        </div>
        <div class="form-group">
            <label>Description</label>
            <!-- <input name="description" placeholder="Description du groupe" class="form-control" v-model="description"> -->
            <textarea-autosize name="description" placeholder="Description du groupe" class="form-control rounded-0" v-model="description"></textarea-autosize>
        </div>
        <div class="form-group">
            <label>Mots-clés</label>
            <input type="text" name="keywords" placeholder="Tapez des mots clés séparés par des espaces" class="form-control rounded-0" v-model="keywords">
        </div>
        <div class="form-group">
            <input type="button" value="Valider" class="btn btn-success rounded-0" v-on:click="createGroup">
        </div>
    </form>
</main>
</template>

<script>
import {
    mapState
} from 'vuex'

export default {
    data: function() {
        return {
            name: "",
            description: "",
            keywords: "",
            invalidData: false
        }
    },
    computed: {
        ...mapState([
            'userLogged'
        ])
    },
    methods: {
        createGroup: function() {

            if (this.name == "" ||
                this.description == "" ||
                this.keywords == "") {

                this.invalidData = true;
            } else {
                let arKeywords = this.keywords.split(" ");
                let requestData = {
                    name: this.name,
                    description: this.description,
                    keywords: arKeywords
                };
                this.$store.dispatch('createGroup', requestData)
                    .then((response) => {
                        this.$router.push('/groupe/' + response.data._id);
                    }, (error) => {
                        console.log(error);
                    });
            }
        },

        getNotifications: function() {
            this.$store.dispatch('getNotificationsAction');
            // console.log(this.$store.state.userNotifs);
            // console.log(this.userNotifs);
        }
    },
    created: function() {
        if (!this.userLogged) {
            this.$store.dispatch('autoLogin')
                .then((response) => {
                    console.log(response);
                    this.getNotifications();
                }, (error) => {
                    console.error(error);
                    this.$router.push('/login');
                });
        }
    }
}
</script>

<style lang="css" scoped>
.card-bg2 {
    /* background-color: #8baed3; */
    background-color: #c3d1dd;
}

.card-bg1 {
    /* background-color: #c3d1dd; */
    background-color: #fff;
}

.card-text2 {
    color: #57515b;
}

.card-text1 {
    color: #57515b;
}
form {
  border: 1px solid #ccc;
  padding: 30px;
  box-shadow: 2px 2px 8px #eee;
}

</style>
