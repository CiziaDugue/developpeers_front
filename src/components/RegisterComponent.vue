<template>
<main>
    <div class="row align-items-center justify-content-center">
        <div class="col-sm-9 col-12 card-bg2 p-5">
            <h2 class="text-center">Inscription</h2>
        </div>
        <div class="col-sm-3 col-12 card-bg1 align-self-stretch">

        </div>
    </div>
    <div class="row align-items-center justify-content-center">
        <div class="col-sm-9 col-12 card-bg1 px-5 py-4">
            <form v-if="this.$store.state.userLogged == false">
                <div class="alert alert-danger rounded-0" v-if="invalidData">
                    Tous les champs doivent être remplis.
                </div>
                <div class="form-group">
                    <label>Nom</label>
                    <input type="text" placeholder="Votre nom" name="name" class="form-control rounded-0 card-bg2" v-model="userName" v-on:keyup.enter="registerUser">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="Votre email" name="email" class="form-control rounded-0 card-bg2" v-model="email" v-on:keyup.enter="registerUser">
                </div>
                <div class="alert alert-danger" v-if="invalidEmail">
                    Adresse email invalide.
                </div>
                <div class="form-group">
                    <label>Mot de passe</label>
                    <input type="password" placeholder="Votre mot de passe" name="password" class="form-control rounded-0 card-bg2" v-model="password" v-on:keyup.enter="registerUser">
                </div>
                <div class="form-group">
                    <label>Confirmer le mot de passe</label>
                    <input type="password" placeholder="Retapez votre mot de passe" name="password-confirm" class="form-control rounded-0 card-bg2" v-model="passwordConfirmation" v-on:keyup.enter="registerUser">
                </div>
                <div class="alert alert-danger rounded-0" v-if="invalidPwdConfirm">
                    Erreur de confirmation de mot de passe.
                </div>
                <div class="form-group row justify-content-center pt-3">
                    <input type="button" value="Créer mon compte" class="cursor-sm btn btn-primary rounded-0 strong-white" v-on:click="registerUser">
                </div>
            </form>
            <div v-if="this.$store.state.userLogged == true">
                <h3>Bienvenue {{this.$store.state.authUserData.name}} !</h3>
                <span>Votre compte a été créé avec succès.</span>
                <router-link to="/">Home</router-link>
            </div>
        </div>
        <div class="col-sm-3 col-12 card-bg2 align-self-stretch">

        </div>
    </div>
</main>
</template>

<script>
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export default {
    data: function() {
        return {
            name: 'RegisterComponent',
            userName: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            invalidData: false,
            invalidPwdConfirm: false,
            invalidEmail: false
        }
    },
    methods: {
        registerUser: function() {
            if (this.userName == "" ||
                this.email == "" ||
                this.password == "" ||
                this.passwordConfirmation == "") {

                this.invalidData = true;

            } else {

                this.invalidData = false;
                this.invalidPwdConfirm = false;
                this.invalidEmail = false;

                if (this.password != this.passwordConfirmation) {

                    this.invalidPwdConfirm = true;

                } else if (!validateEmail(this.email)) {
                    this.invalidEmail = true;
                } else {

                    let registerData = {
                        "name": this.userName,
                        "email": this.email,
                        "password": this.password,
                        "password-confirm": this.passwordConfirmation
                    };
                    this.$store.dispatch('registerUser', registerData)
                        .then((response) => {
                            this.$router.push('/');
                        }, (error) => {
                            console.error(error);
                        });
                }
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
</style>
