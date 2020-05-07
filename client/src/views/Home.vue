<template>
  <div class="home">
        <login></login>
  </div>
</template>

<script>
// @ is an alias to /src
    import login from './../components/login.vue';

export default {
  name: 'Home',
  props: ['groupId'],
  components: {
        "login": login
      }
}
</script>
