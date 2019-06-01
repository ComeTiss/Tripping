<template>
  <v-flex xs8 offset-xs3 mt-5>
    <panel title="New Trip">

      <v-text-field
          label="Title"
          v-model="trip.title"/>
          <div class="error" v-html="error"/>

      <v-btn @click="create">Create</v-btn>
    </panel>
  </v-flex>
</template>

<script>
import Panel from '@/components/Panel'
import TripService from '@/services/TripService'
export default {
  data () {
    return {
      trip: {},
      error: ''
    }
  },
  components: {
    Panel
  },
  methods: {
    async create () {
      if (this.trip.title === undefined || this.trip.title === '') {
        this.error = 'Title Required'
      } else {
        this.trip.authorID = this.$store.state.user.id
        await TripService.post(this.trip)
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style scoped>

  .error {
    color: white;
  }

</style>
