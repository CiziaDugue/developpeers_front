<template>
<main>
    <form>
        <h2>Céer un groupe</h2>
        <div class="form-group">
            <label>Nom</label>
            <input type="text" name="name" placeholder="Nom du groupe" class="form-control" v-model="name">
        </div>
        <div class="form-group">
            <label>Description</label>
            <input name="description" placeholder="Description du groupe" class="form-control" v-model="description">
        </div>
        <div class="form-group">
            <label>Mots-clés</label>
            <input type="text" name="keywords" placeholder="Tapez des mots clés séparés par des espaces" class="form-control" v-model="keywords">
        </div>
        <div class="form-group">
            <input type="button" value="Valider" class="btn btn-success" v-on:click="createGroup">
        </div>
    </form>
</main>
</template>

<script>
export default {
    data: function() {
        return {
            name: "",
            description: "",
            keywords: ""
        }
    },
    methods: {
        createGroup: function() {
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
        },

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

<style lang="css" scoped>

main {
    position: relative;
    right: 0;
    top: 140px;
    width: 1000px;
    margin: 0 auto;
}

form {
  border: 1px solid #ccc;
  padding: 30px;
  box-shadow: 2px 2px 8px #eee;
}

</style>
