<template>
	<b-container>
		<b-row>
			<b-col>
				<h1>{{ questionInfo.text }}</h1>
				<p v-if="timeLeft !== undefined">Time Left{{ getTimeUpdate }}</p>
				<p>{{ getNumberOfAnswers }}</p>
				<b-button @click="btnNextClick">Next</b-button>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<p>{{ questionInfo.description }}</p>
			</b-col>
		</b-row>
		<b-row v-if="getImagesLength > 0">
			<b-col cols="12">
				<b-row>
					<b-col>   
						<img    :src="getImgSrc" width="500" height="500"
								style="border: 3px solid black;"
								/>
					</b-col>
				</b-row>
				<b-row style="text-align: center;" v-if="getImagesLength > 1">
					<b-col cols="4">
						<b-button variant="primary" @click="changeSelectedImage(-1)">previous</b-button>
					</b-col>
					<b-col cols="4">
						{{selectedImageIndex + 1}} / {{getImagesLength}}
					</b-col>
					<b-col cols="4">                                            
						<b-button variant="primary" @click="changeSelectedImage(1)">next</b-button>
					</b-col>
				</b-row>
			</b-col>
		</b-row>
	</b-container>
</template>
<script>
export default {
	name: "Question",
	props: ["questionInfo"],
	data() {
		return {
			interval: undefined,
			timeLeft: undefined,
			answered: 0,
			participants: 0,
			selectedImageIndex: 0
		};
	},
	created() {
		this.participants = this.questionInfo.participants;
		let timeLeft = this.questionInfo.time;
		if (timeLeft > 0) {
			this.timeLeft = timeLeft;
			this.interval = setInterval(() => {
				if (this.timeLeft === 0) {
					this.$socket.emit("forceNextQuestion");
					clearInterval(this.interval);
				} else this.timeLeft--;
			}, 1000);
		}
	},
	beforeDestroy() {
		if (this.interval !== undefined) clearInterval(this.interval);
	},
	computed: {
		getTimeUpdate() {
			let min = Math.floor(this.timeLeft / 60).toString();
			let sec = Math.floor(this.timeLeft % 60).toString();

			return `${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
		},
		getNumberOfAnswers() {
			return `Answers: ${this.answered}/${this.participants}`;
		},
		getImagesLength() {
			return this.questionInfo.object.files.length;
		},
		getImgSrc() {
			console.log(this.questionInfo.object.files);
			let file = this.questionInfo.object.files[this.selectedImageIndex];
			console.log(file);
            return "data:" + file.type + ";base64," + file.buffer;
		}
	},
	sockets: {
		updateNumberOfAnswers(data) {
			this.answered = data[0];
			this.participants = data[1];
		}
	},
	methods: {
		btnNextClick() {
			this.$socket.emit("forceNextQuestion");
		},
		changeSelectedImage(step) {
            if (
                this.selectedImageIndex + step >= 0 && 
                this.selectedImageIndex + step < this.getImagesLength
                ) {
                    this.selectedImageIndex += step;
                }
		}
	}
};
</script>
