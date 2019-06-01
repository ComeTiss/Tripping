<template>
  <v-flex xs8 offset-xs3 mt-5>
        <v-card>
          <v-toolbar dark color="cyan">
            <v-toolbar-title>{{trip.title}}</v-toolbar-title>
            <v-toolbar-items>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                        slot="action"
                        v-on="on"
                        class="white accent-2"
                        light small absolute right middle white fab>
                        <v-icon>update</v-icon>
                  </v-btn>
                </template>
                <span>Update trip details</span>
              </v-tooltip>
            </v-toolbar-items>
          </v-toolbar>

          <!-- #################### PAGE CONTENT ##################### -->
          <v-card>
            <v-card-title>
              <h3>Destinations</h3>
            </v-card-title>
              <v-layout>

                <!-- Content -->
                <v-flex xs6 class="box">
                  <v-template v-if="pointDetails != null">
                      <h4>Title:</h4>{{pointDetails.title}}
                      <br><br>
                      <h4>Content:</h4>{{pointDetails.content}}
                  </v-template>
                </v-flex>

                <!-- List -->
                <v-flex xs6 class="box">
                    <!-- SEARCH BAR HERE -->
                    <v-list
                      v-for="destination in this.destinations.destinations"
                      v-bind:key="destination.id">

                      <v-list-tile
                        @click="getDestinationDetails(destination.id)">
                          <v-list-tile-content>
                            <v-list-tile-title
                              v-html="destination.title">
                            </v-list-tile-title>
                          </v-list-tile-content>
                        </v-list-tile>
                        <v-divider></v-divider>
                      </v-list>
                </v-flex>
              </v-layout>
          </v-card>
        </v-card>
      </v-flex>
</template>

<script>
import Panel from '@/components/Panel'
import TripService from '@/services/TripService'
import DestinationService from '@/services/DestinationService'
export default {
  data () {
    return {
      trip: {},
      destinations: [],
      pointDetails: null,
      switchVisibility: null
    }
  },
  components: {
    Panel
  },
  methods: {
    async getDestinationDetails (id) {
      this.pointDetails = (await DestinationService.getDestination(id)).data
    },
    async clickEvent () {
      const data = {
        visible: this.switchVisibility
      }
      await TripService.updateTrip(this.trip.id, data)
    }
  },
  async mounted () {
    const tripId = this.$store.state.route.params.tripId
    const response = await TripService.showTrip(tripId)
    if (response.data === undefined || response.data === '') {
      this.$router.push({name: 'errorPage'})
    }
    this.trip = response.data
    this.switchVisibility = this.trip.visible
    this.destinations = (await DestinationService.getDestinations(tripId)).data
  }
}
</script>

<style scoped>

.header {
  margin-left: 0;
}

.box {
  margin-left: 6px;
  margin-right: 6px;
  margin-bottom: 3px;
  border: 1px outset;
  height: 200px;
  overflow: auto;
}
</style>
