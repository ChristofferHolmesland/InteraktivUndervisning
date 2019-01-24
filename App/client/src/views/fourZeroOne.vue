<template>
  <div class="401">
    <h1>{{getLocale.unauthorized}}</h1>
    <p v-for="item in getLocale.textList" :key="item">{{item}}</p>
    <b-button @click="homeRedirect">{{getLocale.homeButton}}</b-button>
  </div>
</template>

<script>
export default {
    name: "fourZeroOne",
    methods: {
        homeRedirect() {
            this.$router.push("/");
        }
    },
    computed: {
        getLocale() {
            let locale = this.$store.getters.getLocale("401");
            if(locale) return locale;
            else return {};
        }
    }
}
</script>