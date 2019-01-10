<template>
    <b-container id="LoginForm">
        <b-row align-h="center" class="mt-5">
            <b-col cols="4" class="text-center">
                <b-button id="anonymousButton" @click="displayAnonymousText">{{locale.anonymousButton}}</b-button>
            </b-col>
            <b-col cols="4" class="text-center">
                <b-button id="feideButton" @click="displayFeideText">Feide</b-button>
            </b-col>
        </b-row>
        <b-row align-h="center" class="my-5">
            <b-col cols="8">
                <b-list-group class="border">
                    <b-list-group-item class="border-0" :key="item" v-for="item in getLoginTerms">{{item}}</b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
        <b-row align-h="center">
            <b-col cols="4" class="text-center">
                <b-form-checkbox v-if="feideLogin" v-model="termsApproved">{{locale.acceptCheckbox}}</b-form-checkbox>
                <b-form action="/login/anonymous" ref="submitForm" method="POST" class="align-items-center">
                    <b-button id="loginButton" :disabled="!termsApproved" type="submit">{{locale.loginButton}}</b-button>
                </b-form>
            </b-col>
        </b-row> 
    </b-container>
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