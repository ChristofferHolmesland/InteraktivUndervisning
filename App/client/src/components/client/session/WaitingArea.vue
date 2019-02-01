<template>
    <div id="Waitingarea">
        <b-container>
            <b-row>
                <b-col cols="12">
                    <h1>{{ getLocale.title }}</h1>
                    <p>{{ getLocale.sessionId }}: {{ sessionCode }}</p>
                </b-col>
                <b-col cols="12">
                    <p>{{ getWaitingAreaBody }}</p>
                </b-col>
                <b-col cols="12">
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
                }, 500);
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
                console.log("betweenQuestionsIncorrect")
                console.log(this.localeElement);
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