<template>
  <div class="404">
    <h1>{{locale.headline}}</h1>
    <p>{{locale.text}}</p>
    <b-button @click="homeRedirect">{{locale.homeButton}}</b-button>
  </div>
</template>

<script>
import { dataBus } from "../main";
export default {
    name: "404",
    data() {
        return {
            locale: dataBus.locale["404"]
        }
    },
    mounted() {
        let that = this;
        dataBus.$on("localeLoaded", function(){
            that.locale = dataBus.locale["404"];
        });
    },
    methods: {
        homeRedirect() {
            this.$router.push("/");
        }
    }
}
</script>