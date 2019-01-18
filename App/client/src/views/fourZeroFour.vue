<template>
  <div class="404">
    <h1>{{getLocale.headline}}</h1>
    <p>{{getLocale.text}}</p>
    <b-button @click="homeRedirect">{{getLocale.homeButton}}</b-button>
  </div>
</template>

<script>
export default {
    name: "fourZeroFour",
    methods: {
        homeRedirect() {
            this.$router.push("/");
        }
    },
    computed: {
        getLocale() {
            let locale = this.$store.getters.getLocale("404");
            if(locale) return locale;
            else return {};
        }
    }
}
</script>