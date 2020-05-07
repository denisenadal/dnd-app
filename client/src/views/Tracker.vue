<template>
   
</template>

<script>
    // @ is an alias to /src
    //import _ from 'lodash';
    import loading from './../components/loading.vue';
    import ioList from './../components/ioList.vue';
    import ioForm from './../components/ioForm.vue';

    export default {
        name: 'Tracker',
        props: ['loading'],
        components: {
            "loading": loading,
            "io-list": ioList,
            "ioForm": ioForm
        }
    }
</script>