<template>
  <div id="background">
    <v-layout>
      <v-flex xs6 offset-xs3 mt-5>
        <panel title="Register">
          <form name="tab-tracker-form"
          autocomplete="off">
            <v-text-field
              label="Email"
              v-model="email"/>
            <br>
            <v-text-field
              label="Password"
              type="password"
              v-model="password"
              autocomplete="new-password"/>
            <br>
            <div class="error" v-html="error"/>
            <br>
            <v-btn dark class="blue-grey" @click="register">Register</v-btn>
          </form>
        </panel>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import Panel from '@/components/Panel'
export default {
  data () {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    async register () {
      try {
        const response = await AuthenticationService.register({
          email: this.email,
          password: this.password
        })
        this.$store.dispatch('setToken', response.data.token)
        this.$store.dispatch('setUser', response.data.user)
        this.$router.push({
          name: 'root'
        })
      } catch (error) {
        this.error = error.response.data.error
      }
    }
  },
  components: {
    Panel
  }
}
</script>

<style scoped>

.error {
  color: white;
}

#background {
  height: fill-available;
  height: 100vh;
  background: url("/static/map-passport-blur.png") no-repeat top center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

</style>
