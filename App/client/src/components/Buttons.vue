<template>
    <div id="buttons">
        <button id="annoButton" v-on:click="displayAnnomousText">Anonym</button>
        <button id="feideButton" v-on:click="displayFeideText">Feide</button>
        <!--<div class="textinformation" v-if="feidelogin">
            <ul>

            </ul>
        </div>-->
        <div class="textinformation">
            <ul>
                <li>If you login in with feide you agree to accept our use of cookies</li>
                <li>We don't need to store cookies, however you data will be erased once you leave the site!</li>
            </ul>
        </div>
        <label><input type=radio />Accept</label>
        <button id="loginbutton" disabled>Login</button>


    </div>

</template>

<script>
    export default {
        name: "Buttons",
        data() {
            return {
                feidelogin: false,

            }
        },
        methods: {
            displayAnnomousText(){
                console.log("AnnomousClicked");
                this.feidelogin = false;
            },
            displayFeideText() {
                console.log("FeideClicked");
                this.feidelogin = true;
            }
        }
    }
</script>

<style scoped>

</style>