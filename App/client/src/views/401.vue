<template>
  <div class="401">
    <h1>{{locale.unauthorized}}</h1>
    <p v-for="item in locale.textList" :key="item">{{item}}</p>
    <b-button @click="homeRedirect">{{locale.homeButton}}</b-button>
  </div>
</template>

<script>
import { dataBus } from "../main";
export default {
    name: "401",
    data() {
        return {
            locale: dataBus.locale["401"]
        }
    },
    mounted() {
        let that = this;
        dataBus.$on("localeLoaded", function(){
            that.locale = dataBus.locale["401"];
            console.log(that.locale);
        });
    },
    methods: {
        homeRedirect() {
            this.$router.push("/");
        }
    }
}
</script>