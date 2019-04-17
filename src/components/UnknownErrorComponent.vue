<template>
    <div>
        <div class="card">
            <div class="card-title">
                <h3>Oups !</h3>
                <p>Une erreur inconnue est survenue.</p>
                <router-link :to="/">Revenir à l'accueil</router-link>
            </div>
            <div class="card-body">
                <p>Une erreur inconnue est survenue.</p>
                <hr>
                <router-link to='/'>Revenir à l'accueil</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data: function() {
            return {
                errorType: "error"
            }
        }
    }
</script>
