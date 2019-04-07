<template>
    <b-modal :id="elementId" :ref="elementRef" :title="question.text" style="text-align: left;">
        <p>{{question.description}}</p>
        <p>{{getLocale.time}} {{getTime}}</p>
        <b-container v-if="question.solutionType === 2">
            <p v-for="(choice, index) in question.objects.multipleChoices" :key="index">
                Choice {{index}}: {{choice}}
            </p>
        </b-container>
        <p>{{getLocale.solutionText}}</p>
        <p v-if="question.solutionType === 1">{{question.solution}}</p>
        <GraphDrawer    v-if="question.solutionType === 4"
                        ref="graphdrawer"
                        controlType="Sort"
                        sortType="Mergesort"
                        :steps="question.solution"
                        operatingMode="Presentation"
                        />
        <GraphDrawer    v-if="question.solutionType === 5"
                        ref="graphdrawer"
                        controlType="Sort"
                        sortType="Quicksort"
                        :steps="question.solution"
                        operatingMode="Presentation"
                        />
        <GraphDrawer    v-if="question.solutionType === 7 || question.solutionType === 8"
                        ref="graphdrawer"
                        controlType="Graph0"
                        importType="Tree"
                        operatingMode = "Presentation"
                        :steps="question.solution"
                        :displayEdgeValues = "false"
        />
        <GraphDrawer    v-if="question.solutionType === 9"
                        ref="graphdrawer"
                        controlType="Dijkstra"
                        operatingMode="Presentation"
                        :steps="question.solution"
                        :displayEdgeValues="true"
                        />
        <GraphDrawer    v-if="question.solutionType === 10"
                        ref="graphdrawer"
                        controlType="Python"
                        operatingMode="Presentation"
                        :steps="question.solution"
                        />

    </b-modal>
</template>

<script>
import GraphDrawer from "../../graphDrawer/GraphDrawer.vue";

export default {
    data() {
        return {
            question: {
                id: -1,
                text: "",
                description: "", 
                solutionType: "",
                solution: "",
                time: 0,
                objects: {multipleChoices: []}
            }
        }
    },
    props: {
        elementRef: String,
        elementId: String,
    },
    computed: {
        getLocale() {
            let locale = this.$store.getters.getLocale("AdminQuestions");
            if(locale) return locale;
            else return {};
        },
        getTime() {
            let min = Math.floor(this.question.time / 60).toString();
            let sec = Math.floor(this.question.time % 60).toString();

            return `${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
        }
    },
    components: {
        GraphDrawer
    },
    mounted() {
        this.$root.$on("bv::modal::show", () => {
                if (this.$refs.graphdrawer !== undefined) {
                    this.$nextTick(function() {
                        this.$refs.graphdrawer.createDrawer();
                    });
                }
            });

    },
    watch: {
        "question.solutionType": function() {
            this.$nextTick(function() {
                // After changing the solutionType, the graphdrawer object needs to be
                // recreated.
                if(this.$refs.graphdrawer !== undefined)
                    this.$refs.graphdrawer.createDrawer();
            });
        }
    }
};
</script>

<style scoped>
</style>
