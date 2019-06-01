<template>
  <v-navigation-drawer fixed>
    <v-toolbar flat class="blue-grey">
      <v-list>
        <v-list-tile>
          <v-list-tile-title class="title">
            <p class="title">Tripping</p>
          </v-list-tile-title>
        </v-list-tile>
      </v-list>

    </v-toolbar>

    <v-divider></v-divider>

    <v-list blue dense class="pt-0">
      <v-list-tile
        v-for="item in itemsLogout"
        :key="item.title"
        @click="navigateTo({name: item.route})"
        v-if="!$store.getters.isUserLoggedIn">

        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>

      </v-list-tile>

      <v-list-tile
        v-for="item in itemsLogin"
        :key="item.title"
        @click="navigateTo({name: item.route})"
        v-if="$store.getters.isUserLoggedIn">

        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>

        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>

      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data () {
    return {
      itemsLogin: [
        {title: 'Map', icon: 'map', route: 'root'},
        {title: 'Trips', icon: 'flight_takeoff', route: 'trips'},
        {title: 'Help', icon: 'info', route: 'help'},
        {title: 'Log Out', icon: 'lock', route: 'logout'}
      ],
      itemsLogout: [
        {title: 'Login', icon: 'fingerprint', route: 'login'},
        {title: 'Sign Up', icon: 'input', route: 'register'}
      ]
    }
  },
  methods: {
    async navigateTo (route) {
      if (route.name === 'logout') {
        this.$store.dispatch('setToken', '')
        this.$store.dispatch('setUser', '')
        this.$router.push({
          name: 'login'
        })
      } else {
        // Only allows to access 'route' if user logged in
        if (route.name !== 'root') {
          this.$router.push(route)
        }
        if (this.$store.getters.isUserLoggedIn) {
          this.$router.push(route)
        }
      }
    }
  }
}
</script>

<style scoped>

.title {
  color: white
}

</style>
