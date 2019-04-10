<template>
  <main>
    <form v-if="this.$store.state.userLogged == false">
      <div class="form-group">
        <h2>Créer mon compte</h2>
      </div>
      <div class="form-group">
        <label>Nom</label>
        <input type="text" placeholder="Votre nom" name="name" class="form-control" v-model="userName"/>
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" placeholder="Votre email" name="email" class="form-control" v-model="email"/>
      </div>
      <div class="form-group">
        <label>Mot de passe</label>
        <input type="password" placeholder="Votre mot de passe" name="password" class="form-control" v-model="password"/>
      </div>
      <div class="form-group">
        <label>Confirmer le mot de passe</label>
        <input type="password" placeholder="Retapez votre mot de passe" name="password-confirm" class="form-control" v-model="passwordConfirmation"/>
      </div>
      <div class="form-group">
        <input type="button" value="Valider" class="btn btn-primary" v-on:click="registerUser"/>
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
  export default {
    data: function() {
      return {
        name: 'RegisterComponent',
        userName: '',
        email: '',
        password: '',
        passwordConfirmation: ''
      }
    },
    methods: {
      registerUser: function() {
        let registerData = {
          "name": this.userName,
          "email": this.email,
          "password": this.password,
          "password-confirm": this.passwordConfirmation
        };
        this.$store.dispatch('registerUser', registerData);
      }
    }
  }
</script>

<style scoped>
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
