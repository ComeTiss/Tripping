<template>
  <div id="app">
    <v-app>
        <v-content>
          <page-menu v-if="this.$router.history.current.name != 'landingPage'"/>
          <router-view />
        </v-content>
    </v-app>
  </div>
</template>

<script>
import PageMenu from '@/components/Menu.vue'
export default {
  name: 'App',
  components: {
    PageMenu
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.danger-alert {
  color: red;
}

</style>
