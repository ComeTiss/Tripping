<template>
  <div>
    <div id="background" class="full-height">
      <div class="middle">
        <img class="logo" src="/static/tripping-big.png">
        <v-btn
          large
          color="primary"
          dark
          @click="navigateTo({name: 'root'})"
        >GET STARTED
        </v-btn>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'LandingPage',
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    }
  }
}
</script>

<style scoped>

.full-height {
  height: fill-available;
  min-height: 100vh;

}

#background {
  background: url("/static/landingpage-background-nologo.png") no-repeat top center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
}

.logo {
  max-width: 90%;
}

.middle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

</style>
