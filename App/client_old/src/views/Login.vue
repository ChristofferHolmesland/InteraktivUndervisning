<template>
    <b-container id="LoginForm" class="jumbotron vertical-center">
        <b-row align-h="center">
            <b-col cols="12" lg="4" class="text-center mb-5">
                <b-button size="lg" variant="primary" id="anonymousButton" @click="displayAnonymousText">{{locale.anonymousButton}}</b-button>
            </b-col>
            <b-col cols="12" lg="4" class="text-center mb-5">
                <b-button size="lg" variant="primary" id="feideButton" @click="displayFeideText">Feide</b-button>
            </b-col>
        </b-row>
        <b-row align-h="center" class="mb-2">
            <b-col cols="12" lg="9">
                <b-list-group>
                    <b-list-group-item class="border-0" :key="item" v-for="item in getLoginTerms"><li>{{item}}</li></b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
        <b-row align-h="center">
            <b-col cols="12" lg="4" class="text-center">
                <b-form-checkbox v-if="feideLogin" v-model="termsApproved">{{locale.acceptCheckbox}}</b-form-checkbox>
                <b-form action="/login/feide" ref="submitForm" method="POST" class="align-items-center mt-4" v-if="feideLogin">
                    <b-button size="lg" variant="primary" id="loginButton" :disabled="!termsApproved" type="submit">{{locale.loginButton}}</b-button>
                </b-form>
                <b-button size="lg" variant="primary" id="loginButton" type="submit" v-if="!feideLogin" @click="loginAnonymously">{{locale.loginButton}}</b-button>
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
            },
            displayFeideText() {
                this.termsApproved = false;
                this.feideLogin = true;
            },
            loginAnonymously() {
                this.socket.emit("loginAnonymouslyRequest");
            }
        },
        mounted() {
            let that = this;
            dataBus.$on("localeLoaded", function(){
                that.locale = dataBus.locale["LoginForm"];
            });

            that.socket.on("loginAnonymouslyResponse", function(){
                that.$router.push("/client");
            });
        },
        computed: {
            getLoginTerms: function() {
                return this.feideLogin ? this.locale.feideList : this.locale.anonymousList;
            }
        }
    };
</script>

<style scoped>
    #LoginForm {
        margin-top: 2rem
    }
</style>
