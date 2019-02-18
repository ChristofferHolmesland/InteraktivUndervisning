<template>
	<div class="Client">
		<h1>This is the client page</h1>
		<b-container>
			<b-row>
				<b-col cols="12" lg="4">
					<JoinSession/>
				</b-col>
				<b-col cols="12" lg="8">
					<GraphDrawer controlType="Sort" sortType="Mergesort" :steps="steps" />
				</b-col>
			</b-row>
		</b-container>
	</div>
</template>

<script>
import JoinSession from "../components/client/JoinSession.vue";
import GraphDrawer from "../components/graphDrawer/GraphDrawer.vue";

export default {
	name: "client",
	components: {
		JoinSession,
		GraphDrawer
	},
	data() {
		return {
			steps: [
				{
					type: "Initial",
					list: [10, 9, 2, 3, 11, 7, 5],
				},
				{ 
					type: 'Split',
  					list: [ 10, 9, 2, 3, 11, 7, 5 ],
  					left: [ 10, 9, 2, 3 ],
					  right: [ 11, 7, 5 ] 
				},
				{ 
					type: 'Split',
					list: [ 10, 9, 2, 3 ],
					left: [ 10, 9 ],
					right: [ 2, 3 ] 
				},
				{ 
					type: 'Split', 
					list: [ 10, 9 ], 
					left: [ 10 ], 
					right: [ 9 ] 
				},
				{ 
					type: 'Merge', 
					list1: [ 10 ], 
					list2: [ 9 ], 
					merged: [ 9, 10 ]
				},
				{ 
					type: 'Split', 
					list: [ 2, 3 ], 
					left: [ 2 ], 
					right: [ 3 ] 
				},
				{ 
					type: 'Merge', 
					list1: [ 2 ], 
					list2: [ 3 ], 
					merged: [ 2, 3 ] 
				},
				{ 
					type: 'Merge',
					list1: [ 9, 10 ],
					list2: [ 2, 3 ],
					merged: [ 2, 3, 9, 10 ]
				},
				{ 
					type: 'Split',
					list: [ 11, 7, 5 ],
					left: [ 11, 7 ],
					right: [ 5 ]
				},
				{ 
					type: 'Split', list: [ 11, 7 ], left: [ 11 ], right: [ 7 ] },
				{ type: 'Merge', list1: [ 11 ], list2: [ 7 ], merged: [ 7, 11 ] },
				{ type: 'Merge',
				list1: [ 7, 11 ],
				list2: [ 5 ],
				merged: [ 5, 7, 11 ] },
				{ type: 'Merge',
				list1: [ 2, 3, 9, 10 ],
				list2: [ 5, 7, 11 ],
				merged: [ 2, 3, 5, 7, 9, 10, 11 ] }
			]
		}
	},
	created() {
		this.$socket.emit("verifyUserLevel", 1);
	}
};
</script>

<style scoped>
h1 {
	margin-top: 3rem;
	text-align: center;
}
</style>
