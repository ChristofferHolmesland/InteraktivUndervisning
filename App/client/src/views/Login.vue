<template>
    <div id="LoginForm">
        <div class="mx-auto" style="min-width: 300px; max-width: 600px;">
            <div style="display: inline-block; width:50%;" class="text-center">
                <b-button id="anonymousButton" @click="displayAnonymousText">{{locale.anonymousButton}}</b-button>
            </div>
            <div style="display: inline-block; width:50%;" class="text-center">
                <b-button id="feideButton" @click="displayFeideText">Feide</b-button>
            </div>
        </div>

        <b-list-group class="mx-auto border" style="min-width: 300px; max-width: 600px;">
            <b-list-group-item class="border-0" :key="item" v-for="item in getLoginTerms">{{item}}</b-list-group-item>
        </b-list-group>
        <div class="text-center">
            <label v-if="feideLogin"><input type=checkbox @click="termsStateChanged"/>{{locale.acceptCheckbox}}</label>
            <b-form action="/login/anonymous" ref="submitForm" method="POST" class="align-items-center">
                <b-button id="loginButton" :disabled="!termsApproved" type="submit">{{locale.loginButton}}</b-button>
            </b-form>
        </div> 
    </div>
</template>

<script>
    import { dataBus } from "../main";
    import superagent from "superagent"
    export default {
        name: "Login",
        data() {
            return {
                feideLogin: false,
                socket: dataBus.socket,
                locale: dataBus.locale["LoginForm"],
                termsApproved: true,
                Login: false,
            };
        },
        methods: {
            displayAnonymousText() {
                this.termsApproved = true;
                this.feideLogin = false;
                this.socket.emit("loginRequest", {loginType: this.feideLogin});
            },
            displayFeideText() {
                this.termsApproved = false;
                this.feideLogin = true;
                this.socket.emit("loginRequest", {loginType: this.feideLogin});
            },
            termsStateChanged() {
                this.termsApproved = !this.termsApproved;
            }
        },
        mounted() {
            let that = this;
            dataBus.$on("localeLoaded", function(){
                that.locale = dataBus.locale["LoginForm"];
            });

            this.socket.on("loginResponse", function(data){
                that.$refs.submitForm.action = data.actionLink;
            });
        },
        computed: {
            getLoginTerms: function() {
                return this.feideLogin ? this.locale.feideList : this.locale.anonymousList;
            }
        }
    };
</script>