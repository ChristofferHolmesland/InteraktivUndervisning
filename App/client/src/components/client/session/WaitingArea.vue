<template>
    <div id="Waitingarea">
        <b-container>
            <b-row>
                <b-col sm="12" offset-sm="5" class="mt-5 mb-3" lg="12" offset-lg="1">
                    <h1>{{ getLocale.title }}</h1>
                    <p>{{ getLocale.sessionId }}: {{ sessionCode }}</p>
                </b-col>
                <b-col sm="12" offset-sm="5" lg="12" class="ml-2 mr-2" offset-lg="5">
                    <p>{{ getWaitingAreaBody }}</p>
                </b-col>
                <b-col sm="12" offset-sm="5" lg="3" offset-lg="1">
                    <b-button variant="danger" @click="leaveSession">{{ getLocale.leaveSession }}</b-button>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
	export default {
        name: "Waitingarea",
        data() {
            return {
                interval: undefined,
                emptyLocaleElement: "",
                text: ""
            }
        },
        props: [
        	"sessionCode",
            "localeElement"
        ],
        created() {
            if (this.localeElement !== "sessionFinished") {
                this.interval = setInterval(() => {
                    if (this.emptyLocaleElement === "...") this.emptyLocaleElement = "";
                    else this.emptyLocaleElement += ".";
                }, 1500);
            }
        },
        beforeDestroy() {
            if (this.interval !== undefined) clearInterval(this.interval);
        },
        methods: {
			leaveSession(){
			    this.$socket.emit("leaveSession",this.sessionCode);
		    }
        },
        computed: {
            getLocale() {
                let locale = this.$store.getters.getLocale("ClientSessionWaitingArea");
                if(locale) {
                    if (this.localeElement !== "sessionFinished") this.text = locale[this.localeElement]; 
                    return locale;
                }
                return {};
            },
            getWaitingAreaBody() {
                if (this.localeElement !== "sessionFinished") return this.text + this.emptyLocaleElement;
                else return this.text;
            }
        },
	}
</script>