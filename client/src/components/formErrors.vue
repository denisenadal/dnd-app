<template>
<div class="message is-danger">
    <p class="message-body content">
        <strong>Please correct the following
            error(s):</strong>
        <ul>
            <li v-for="error in errors" v-bind:key="error">
                {{ error }}</li>
        </ul>
    </p>
</div>
            
</template>

<script>
    export default {
        props: ["errors"]
    }
</script>

<style>

</style>