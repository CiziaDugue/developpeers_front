<template>
  <main>
      <div class="card">
          <div class="card-title">
              <h2>Mon profil</h2>
          </div>
          <div class="card-body">
              <div class="profile_pic">
                <img src="@/assets/blank_profile_pic.png"/>
                <button type="button" class="btn btn-sm btn-outline-primary">Changer</button>
              </div>

              <div class="list-group list-group-flush">
                  <ul>
                      <li class="list-group-item">Nom : {{authUserData.name}}</li>
                      <li class="list-group-item">Email : {{ authUserData.email }}</li>
                      <li class="list-group-item"> <a href="">Réinitialiser mon mot de passe</a></li>
                      <li class="list-group-item"> <a href="">Supprimer mon compte</a></li>
                  </ul>
              </div>
          </div>

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
        'authUserData',
        'userLogged'
      ])
    },
    created: function() {
        if (!this.userLogged) {
            this.$store.dispatch('autoLogin')
                        .then((response)=>{
                            //
                        }, (error)=>{
                            console.error(error);
                            this.$router.push('/login');
                        });
        }
    }
}
</script>

<style scoped>
main {
    /* position: relative;
    left: 50px;
    top: 100px;
    max-width: 1200px;
    margin: 0 auto; */
    border: 1px solid #eee;
}

.profile_pic {
    width: 100px;

}

.profile_pic img {
    width: 100%;
}
</style>
