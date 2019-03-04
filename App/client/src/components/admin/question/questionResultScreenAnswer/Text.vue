<template>
    <b-container>
        <b-row>
            <b-col>
                <h4>{{answer}}</h4>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
export default {
    name:"TextAnswer",
    props: {
        answer: String
    }
}
</script>
