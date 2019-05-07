<template>
    <b-container>
        <b-row>
            <b-col>
                <b-card no-body align-h="center">
                    <b-tabs v-model="tabIndex" card>
                        <b-tab  :title="getLocale.administrator"
                                >
                            <b-container>
                                <b-row>
                                    <b-col>
                                        <b-form-group>
                                            <b-form-radio   v-model="selecetedUserRight"
                                                            name="some-radios"
                                                            :value="4"
                                                            >
                                                {{ getLocale.administrator }}
                                            </b-form-radio>
                                            <b-form-radio   v-model="selecetedUserRight"
                                                            name="some-radios"
                                                            :value="3"
                                                            >
                                                {{ getLocale.studentAssistant }}
                                            </b-form-radio>
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                                <b-row>
                                    <b-col cols="8">
                                        <b-form-select  :options="getNoUserRightCoursList"
                                                        v-model="selectedCourse"
                                                        >
                                            <template   slot="first"
                                                        v-if="getNoUserRightCoursListLength === 0"
                                                        >
                                                <option :value="undefined"
                                                        disabled
                                                        >
                                                    {{ getLocale.noList }}
                                                </option>
                                            </template>
                                        </b-form-select>
                                    </b-col>
                                    <b-col cols="4">
                                        <b-button   block
                                                    variant="success"
                                                    @click="applyUserRight"
                                                    >
                                            {{ getLocale.applyBtnText }}
                                        </b-button>
                                    </b-col>
                                </b-row>
                            </b-container>
                        </b-tab>
                        <b-tab  :title="getLocale.adminApplications"
                                >
                            <b-container>
                                <b-row v-for="course in getAppliedList" :key="course.id">
                                    <b-col cols="8">
                                        {{ getCourseName(
                                                course.code,
                                                course.season,
                                                course.year
                                            ) 
                                        }} 
                                        | 
                                        {{ course.userRight === 3 ?
                                            getLocale.studAssLabel :
                                            getLocale.adminLabel 
                                        }}
                                    </b-col>
                                    <b-col cols="4">
                                        <b-button   variant="danger"
                                                    @click="removeApplication(course.id)"
                                                    >
                                            <i class="far fa-trash-alt"></i>
                                        </b-button>
                                    </b-col>
                                </b-row>
                                <b-row v-if="getAppliedList.length === 0">
                                    <b-col>
                                        {{ getLocale.noAppliedList }}
                                    </b-col>
                                </b-row>
                            </b-container>
                        </b-tab>
                    </b-tabs>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    name: "RequestAdmin",
    data() {
        return {
            tabIndex: 0,
            selecetedUserRight: 4,
            noUserRightCoursList: [],
            selectedCourse: undefined,
            appliedList: []
        }
    },
    created() {
        this.$socket.emit("requestAdminInfoRequest");
    },
    computed: {
        getLocale: function() {
			let locale = this.$store.getters.getLocale("AdminDashboard");
			if (locale) return locale;
			else return {};
        },
        getNoUserRightCoursList: function() {
            let response = [];
            for (let i = 0; i < this.noUserRightCoursList.length; i++) {
                let course = this.noUserRightCoursList[i];
                response.push({
                    text: `${course.code} ${this.getLocale.season[course.season]} ${course.year}`,
                    value: course.id
                });
            }
            return response;
        },
        getNoUserRightCoursListLength: function() {
            return this.noUserRightCoursList.length;
        },
        getAppliedList: function() {
            return this.appliedList;
        },
        getCourseName: function() {
            return (code, season, year) => {
                return `${code} ${this.getLocale['season'][season]} ${year}`
            };
        }
    },
    methods: {
        getInfo: function() {
            this.$socket.emit("requestAdminInfoRequest");
        },
        applyUserRight: function() {
            if (this.selectedCourse === undefined) return;
            this.$socket.emit("applyUserRightRequest", this.selectedCourse, this.selecetedUserRight);
        },
        removeApplication: function(applicationId) {
            this.$socket.emit("removeApplicationRequest", applicationId);
        }
    },
    sockets: {
        requestAdminInfoResponse: function(data) {
            this.noUserRightCoursList = data.noUserRightCoursList;
            if (this.noUserRightCoursList.length > 0) this.selectedCourse = this.noUserRightCoursList[0].id;
            else this.selectedCourse = undefined;
            this.appliedList = data.appliedList;
        },
        applyResponse: function() {
            this.tabIndex = 2;
        },
        removeApplicationResponse: function() {
            this.getInfo();
        }
    },
    watch: {
        tabIndex: function() {
            this.getInfo();
        }
    },
}
</script>
