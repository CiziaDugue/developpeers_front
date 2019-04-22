<template>
<main>
    <div class="row align-items-center justify-content-center">
        <div class="col-sm-9 col-12 card-bg1 p-5">
            <h2 class="text-center">Connexion</h2>
        </div>
        <div class="col-sm-3 col-12 card-bg2 align-self-stretch">

        </div>
    </div>
    <div class="row align-items-center justify-content-center">
        <div class="col-sm-9 col-12 card-bg2 p-5">
            <form v-if="this.$store.state.userLogged == false">
                <div class="alert alert-danger rounded-0" v-if="wrongLoginOrPwd">
                    Mauvais login ou mot de passe
                </div>
                <div class="alert alert-danger rounded-0" v-if="invalidData">
                    Tous les champs doivent être remplis.
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="Votre email" name="email" class="form-control rounded-0" v-model="email" />
                </div>
                <div class="form-group">
                    <label>Mot de passe</label>
                    <input type="password" placeholder="Votre mot de passe" name="password" class="form-control rounded-0" v-model="password" v-on:keyup.enter="logUser" />
                </div>
                <div class="form-group row justify-content-center pt-3">
                    <input type="button" value="Se connecter" class="cursor-sm btn btn-primary rounded-0 strong-white" v-on:click="logUser" />
                </div>
            </form>
            <div v-if="this.$store.state.userLogged == true">
                <h3>Bienvenue {{this.$store.state.authUserData.name}} !</h3>
                <span>Vous vous êtes connecté avec succès.</span>
                <router-link to="/">Home</router-link>
            </div>
        </div>
        <div class="col-sm-3 col-12 card-bg1 align-self-stretch">

        </div>
    </div>
</main>
</template>

<script>
export default {
    data: function() {
        return {
            name: 'LoginComponent',
            email: '',
            password: '',
            wrongLoginOrPwd: false,
            invalidData: false
        }
    },
    methods: {
        logUser: function() {
            if (this.email == "" ||
                this.password == "") {
                this.invalidData = true;
            } else {
                let logData = {
                    "email": this.email,
                    "password": this.password
                };
                this.$store.dispatch('logUser', logData)
                    .then((response) => {
                        //setTimeout( () => {
                        this.$router.push('/');
                        //}, 1000);
                    }, (error) => {
                        console.error(error);
                        this.wrongLoginOrPwd = true;
                    });
            }
        }
    }
}
</script>

<style scoped>
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
    /* box-shadow: 2px 2px 8px #eee; */
}
</style>
