<template>
  <v-flex xs8 offset-xs3 mt-5>

    <panel title="My Trips">

      <v-btn
            slot="action"
            @click="navigateTo({name: 'trips-create'})"
            class="white accent-2"
            light
            medium
            absolute
            right
            middle
            white
            fab>
            <v-icon>add</v-icon>
        </v-btn>

        <!-- DISPLAY USER TRIPS-->

        <v-list>
          <template v-for="trip in trips">
            <v-list-tile
              v-bind:key="trip.id">

              <!-- Content -->
                <v-list-tile-content>
                  <v-list-tile-title
                    v-html="trip.title">
                  </v-list-tile-title>
                </v-list-tile-content>

              <!-- Right side Buttons -->
                <v-list-tile-action>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn icon ripple>
                        <v-icon
                          color="grey lighten-1"
                          v-on="on"
                          @click="navigateTo({path: `/trip-details/${trip.id}`})">
                          info
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Access Trip page</span>
                  </v-tooltip>
                </v-list-tile-action>

                <v-list-tile-action>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <v-btn icon ripple>
                        <v-icon
                          color="grey lighten-1"
                          v-on = "on"
                          @click="deleteTrip(trip)">
                          delete_forever</v-icon>
                      </v-btn>
                    </template>
                    <span>Delete this trip</span>
                  </v-tooltip>
              </v-list-tile-action>
            </v-list-tile>
          </template>
      </v-list>
    </panel>
  </v-flex>
</template>

<script>

import TripService from '@/services/TripService'
import DestinationService from '@/services/DestinationService'
import Panel from '@/components/Panel'
export default {
  data () {
    return {
      trips: null
    }
  },
  components: {
    Panel
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    async deleteTrip (trip) {
      const userId = this.$store.state.user.id
      await TripService.deleteTrip(userId, trip.id)
      this.trips.splice(this.trips.indexOf(trip), 1)
      // delete all destinations of this trip
      await DestinationService.deleteTripDestinations(trip.id)
      this.$eventHub.$emit('deleteTrip', trip.id)
    }
  },
  async mounted () {
    // Make a request for trips data to back end
    const userId = this.$store.state.user.id
    this.trips = (await TripService.getTrips(userId)).data
  }
}
</script>

<style scoped>

</style>
