<template>
<main>
    <div class="row align-items-center justify-content-center">
        <div class="col-sm-9 col-12 card-bg2 p-5">
            <h2 class="text-center">Nouvelle Version</h2>
        </div>
        <div class="col-sm-3 col-12 card-bg1 align-self-stretch p-5">
            <p class="text-center card-text1">
                Article
                <router-link :to="{ name: 'notificatedPost', params: { postId: postSingle._id, versionId: postSingle.active_version._id }}">
                    {{ postSingle.title }}
                </router-link>
            </p>
            <p class="text-center card-text1">
                Éditée à partir de la version <strong>{{previousVersionNb}}</strong>
            </p>
        </div>
    </div>
    <form>
        <h2>Créer une nouvelle version</h2>
        <div class="alert alert-danger" v-if="invalidFormMsg != ''">
            {{invalidFormMsg}}
        </div>
        <div class="form-group">
            <h3>{{title}}</h3>
        </div>
        <div class="form-group">
            <span>Édité à partir de la version {{previousVersionNb}}</span>
            <br>
            <label>Numéro de la nouvelle version : </label>
            <input type="text" v-model="number" placeholder="exemple : 1.2 ou 2.0 ...">
        </div>

        <div class="form-group">
            <textarea-autosize class="form-control rounded-0" v-model="textContent"></textarea-autosize>
        </div>

        <div v-for="snippet in codeSnippets">
            <div class="form-group">
                <textarea-autosize class="form-control rounded-0" v-model="codeSnippets[snippet.index].content"></textarea-autosize>
            </div>
        </div>

        <div class="form-group">
            <button type="button" name="button" v-on:click="addCodeSnippet">Ajouter un bloc de code</button>
        </div>

        <div class="form-group">
            <input type="button" value="Valider" class="btn btn-success rounded-0" v-on:click="validateNewVersion">
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
            title: "",
            textContent: "",
            number: "",
            codeSnippets: [],
            csLength: 0,
            invalidFormMsg: "",
            previousVersionNb: null
        }
    },
    computed: {
        ...mapState([
            'postSingle',
            'userLogged'
        ])
    },
    methods: {
        validateNewVersion: function() {
            if (this.title == "" ||
                this.textContent == "" ||
                this.codeSnippets[0].content == "" ||
                this.keywords == "" ||
                this.selectedGroup == "" ||
                this.number == "") {

                this.invalidFormMsg = "Tous les champs doivent être remplis.";

            } else {

                let data = {
                    postId: this.postSingle._id,
                    requestData: {
                        text_content: this.textContent,
                        number: this.number,
                        code_snippets: []
                    }
                };

                let i = 0;
                this.codeSnippets.forEach(cs => {
                    data.requestData.code_snippets[i] = cs.content;
                    i++;
                });
                this.$store.dispatch('commitVersion', data)
                    .then((response) => {
                        this.$router.push('/article/' + this.postSingle._id);
                    }, (error) => {
                        console.log(error);
                    });
            }

        },

        addCodeSnippet: function() {
            this.codeSnippets.push({
                index: this.csLength,
                content: ""
            });
            this.csLength++;
        },

        getNotifications: function() {
            this.$store.dispatch('getNotificationsAction');
            // console.log(this.$store.state.userNotifs);
            // console.log(this.userNotifs);
        },

        initForm: function() {
            this.title = this.postSingle.title;
            this.textContent = this.postSingle.active_version.text_content;
            let i = 0;
            this.postSingle.active_version.code_snippets.forEach((cs) => {
                this.codeSnippets[i] = {
                    index: i,
                    content: cs.content
                };
                i++;
            });
            this.csLength = i;
            this.previousVersionNb = this.postSingle.active_version.number;
        }
    },
    created: function() {
        if (!this.userLogged) {
            this.$store.dispatch('autoLogin')
                .then((response) => {
                    if (!this.postSingle.title) {
                        let payload = {
                            postId: this.$route.params.postId
                        };
                        this.$store.dispatch('initPostSingleAction', payload)
                            .then((response) => {
                                this.initForm();
                                this.getNotifications();
                            }, (error) => {
                                console.error(error);
                                this.$router.push('/oups');
                            });
                    } else {
                        this.initForm();
                        this.getNotifications();
                    }
                }, (error) => {
                    console.error(error);
                    this.$router.push('/login');
                });
        } else {
            this.initForm();
            this.getNotifications();
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
