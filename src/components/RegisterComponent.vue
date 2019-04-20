<template>
  <main>
    <form v-if="this.$store.state.userLogged == false">
      <div class="form-group">
        <h2>Créer mon compte</h2>
      </div>
      <div class="alert alert-danger" v-if="invalidData">
          Tous les champs doivent être remplis.
      </div>
      <div class="form-group">
        <label>Nom</label>
        <input type="text" placeholder="Votre nom" name="name" class="form-control rounded-0" v-model="userName" v-on:keyup.enter="registerUser"/>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" placeholder="Votre email" name="email" class="form-control rounded-0" v-model="email" v-on:keyup.enter="registerUser"/>
      </div>
      <div class="alert alert-danger" v-if="invalidEmail">
          Adresse email invalide.
      </div>
      <div class="form-group">
        <label>Mot de passe</label>
        <input type="password" placeholder="Votre mot de passe" name="password" class="form-control rounded-0" v-model="password" v-on:keyup.enter="registerUser"/>
      </div>
      <div class="form-group">
        <label>Confirmer le mot de passe</label>
        <input type="password" placeholder="Retapez votre mot de passe" name="password-confirm" class="form-control rounded-0" v-model="passwordConfirmation" v-on:keyup.enter="registerUser"/>
      </div>
      <div class="alert alert-danger" v-if="invalidPwdConfirm">
          Erreur de confirmation de mot de passe.
      </div>
      <div class="form-group">
        <input type="button" value="Valider" class="btn btn-primary rounded-0" v-on:click="registerUser"/>
      </div>
    </form>
    <div v-if="this.$store.state.userLogged == true">
      <h3>Bienvenue {{this.$store.state.authUserData.name}} !</h3>
      <span>Votre compte a été créé avec succès.</span>
      <router-link to="/">Home</router-link>
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
          if(this.userName == ""
          || this.email == ""
          || this.password == ""
          || this.passwordConfirmation == "") {

              this.invalidData = true;

          } else {

              this.invalidData = false;
              this.invalidPwdConfirm = false;
              this.invalidEmail = false;

              if(this.password != this.passwordConfirmation) {

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
                  .then((response)=>{
                      this.$router.push('/');
                  },(error)=>{
                      console.error(error);
                  });
              }
          }
      }
    }
  }
</script>

<style scoped>
main {
    /* position: relative;
    right: 0;
    top: 140px;
    width: 1000px;
    margin: 0 auto; */
}

form {
  border: 1px solid #ccc;
  padding: 30px;
  /* box-shadow: 2px 2px 8px #eee; */
}
</style>
