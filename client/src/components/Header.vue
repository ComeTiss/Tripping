<template>

  <v-toolbar dark fixed class="cyan">
    <v-toolbar-title class="mr-4">
      <span class="home" @click="navigateTo({name:'root'})">
      Home
      </span>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-btn
      v-if="!$store.state.isUserLoggedIn"
      flat dark @click="navigateTo({name: 'login'})">
        Login
      </v-btn>

      <v-btn
      v-if="!$store.state.isUserLoggedIn"
      flat dark @click="navigateTo({name: 'register'})">
        Sign Up
      </v-btn>
      <v-btn
      v-if="$store.state.isUserLoggedIn"
      flat dark @click="logout">
        Log Out
      </v-btn>
    </v-toolbar-items>

  </v-toolbar>
</template>

<script>
export default {
  methods: {
    navigateTo (route) {
      // Only allows to access 'route' if user logged in
      if (route.name !== 'root') {
        this.$router.push(route)
      }
      console.log(route.name)
      if (this.$store.state.isUserLoggedIn) {
        this.$router.push(route)
      }
    },
    logout () {
      this.$store.dispatch('setToken', null)
      this.$store.dispatch('setUser', null)
      this.$router.push({
        name: 'login'
      })
    }
  }
}
</script>

<style scoped>

.home {
  cursor: pointer;
}
.home:hover {
  color: grey;
}
</style>
