<template>
    <v-layout>
      <v-flex>
        <MyMap>
        </MyMap>
      </v-flex>

      <!-- ################ Top Bar containing 'Create' Button ################ -->
      <v-flex xs3 mt-5 mr-4>
        <v-card>
          <v-toolbar dark color="blue-grey">
            <v-toolbar-items>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                        slot="action"
                        @click="navigateTo({name: 'trips-create'})"
                        class="white accent-2"
                        v-on="on"
                        light small absolute right middle white fab>
                        <v-icon>add</v-icon>
                  </v-btn>
                </template>
                <span>Create a Trip</span>
              </v-tooltip>
            </v-toolbar-items>
          </v-toolbar>

          <!-- ################ List of Trips ################ -->
            <slot>
              <div class="trips-box">
                <v-list>
                  <v-list-group
                    class="tripColor"
                    v-for="trip in trips"
                    :key="trip.tripDetails.id">
                    <template
                      v-slot:activator
                      v-if="trip.tripDetails.id >= 0">

                      <!-- drop down with buttons -->
                      <v-menu class="dropdown-menu">
                        <template v-slot:activator="{ on }">
                          <v-btn icon ripple>
                            <v-icon
                              v-on="on">
                              more_vert</v-icon>
                          </v-btn>
                       </template>
                          <div v-for="link in links" :key="link.name">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn icon ripple>
                                  <v-icon
                                    v-on="on"
                                    @click="doSomething(trip, link)"
                                    color="black lighten-1">
                                    {{link.icon}}
                                  </v-icon>
                                </v-btn>
                              </template>
                              <span>{{link.name}}</span>
                            </v-tooltip>
                          </div>
                          <div v-if="trip.tripDetails.visible === true">
                            <v-tooltip top>
                              <template v-slot:activator="{ on }">
                                <v-btn icon ripple>
                                  <v-icon
                                    v-on="on"
                                    @click="doSomething(trip, {type: 'show'})"
                                    color="black lighten-1">
                                    visibility_off
                                  </v-icon>
                                </v-btn>
                              </template>
                              <span>Hide from Map</span>
                            </v-tooltip>
                          </div>
                      </v-menu>

                      <!-- Dropdown with trip destinations -->
                        <v-list-tile>
                          <v-list-tile-content>
                             <p>{{ trip.tripDetails.title }}</p>
                          </v-list-tile-content>
                        </v-list-tile>
                      <div v-if="trip.tripDetails.visible === false">
                        <v-tooltip top>
                          <template v-slot:activator="{ on }">
                            <v-btn icon ripple>
                              <v-icon
                                v-on="on"
                                @click="doSomething(trip, {type: 'show'})"
                                color="grey lighten-1">
                                visibility
                              </v-icon>
                            </v-btn>
                          </template>
                          <span>Show on Map</span>
                        </v-tooltip>
                      </div>
                    </template>
                    <v-list-tile
                        v-for="point in trip.destinations.destinations"
                        :key="point.id">
                      <v-list-tile-content>
                        <v-list-tile-title>{{point.title}}</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list-group>
                </v-list>
              <v-divider></v-divider>
            </div>
          </slot>
        </v-card>
      </v-flex>
  </v-layout>
</template>

<script>
import MyMap from '@/components/MyMap.vue'
import TripService from '@/services/TripService'
import DestinationService from '@/services/DestinationService'

export default {
  data () {
    return {
      trips: [],
      tripAddingPoint: null,
      links: [
        {name: 'See More', type: 'route', icon: 'info'},
        {name: 'Add Destination', type: 'add', icon: 'add_location'},
        {name: 'Delete', type: 'delete', icon: 'delete'}
      ]
    }
  },
  components: {
    MyMap
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    async doSomething (trip, link) {
      // Trip Dropdown menu options

      if (link.type === 'route') {
        this.$router.push(`/trip-details/${trip.tripDetails.id}`)
      }
      if (link.type === 'delete') {
        const userId = this.$store.state.user.id
        // delete trip
        await TripService.deleteTrip(userId, trip.tripDetails.id)
        this.trips.splice(this.trips.indexOf(trip), 1)
        // delete all destinations of this trip
        await DestinationService.deleteTripDestinations(trip.tripDetails.id)
        this.$eventHub.$emit('deleteTrip', trip.tripDetails.id)
      }
      if (link.type === 'add') {
        this.tripAddingPoint = trip
        this.$eventHub.$emit('newMarker', trip.tripDetails.id)
      }
      if (link.type === 'show') {
        this.$eventHub.$emit('hideTrip', trip.tripDetails.id, trip.tripDetails.visible)
        const changeMode = !trip.tripDetails.visible
        trip.tripDetails.visible = changeMode
        await TripService.updateTrip(trip.tripDetails.id, {visible: changeMode})
      }
    },
    async deletePoint (trip, point) {
      // TODO: NOT USED ANYMORE BUT KEEP FOR NOW
      await DestinationService.deleteDestination(point.id)
      const index = this.trips.indexOf(trip)
      const pointIndex = this.trips[index].destinations.destinations.indexOf(point, 1)
      this.trips[index].destinations.destinations.splice(pointIndex, 1)
    },
    async updateOneTripDestinations (mode, data) {
      for (let i = 0; i < this.trips.length; i++) {
        for (let j = 0; j < this.trips[i].destinations.destinations.length; j++) {
          if (this.trips[i].destinations.destinations[j].id === data.id) {
            if (mode === 'update') {
              this.trips[i].destinations.destinations[j].title = data.title
            }
            if (mode === 'delete') {
              this.trips[i].destinations.destinations.splice(j, 1)
            }
          }
        }
      }
    },
    updateColor () {
      const elements = document.getElementsByClassName('tripColor')

      for (var i = 0; i < elements.length; i++) {
        elements[i].style.borderLeftWidth = '4px'
        elements[i].style.borderLeftStyle = 'solid'
        elements[i].style.borderLeftColor = this.trips[i].color
      }
    }
  },
  async mounted () {
    // Make a request for trips data to back end
    const userId = this.$store.state.user.id
    const tripsdata = (await TripService.getTrips(userId)).data
    // Emit message to tell map not to draw invisible trips

    // Make request for all destinations for each trip
    for (let i = 0; i < tripsdata.length; i++) {
      const tripId = tripsdata[i].id
      const destinations = (await DestinationService.getDestinations(tripId)).data
      const newtrip = {
        tripDetails: tripsdata[i],
        color: '',
        destinations: destinations
      }
      this.trips.push(newtrip)
    }
    // Handles Events happening on the map & refre
    this.$eventHub.$on('markerAdded', (data) => {
      if (this.trips.length > 0) {
        const index = this.trips.indexOf(this.tripAddingPoint)
        this.trips[index].destinations.destinations.push(data.destination)
        if (this.trips[index].colo === undefined) {
          this.trips[index].color = data.color
          this.updateColor()
        }
      }
    })
    this.$eventHub.$on('DoneDeleteMarker', (destinationId) => {
      const data = {id: destinationId}
      this.updateOneTripDestinations('delete', data)
    })
    this.$eventHub.$on('UdaptedMarker', (markerData) => {
      const data = {
        id: markerData.id,
        title: markerData.data.title
      }
      this.updateOneTripDestinations('update', data)
    })
    this.$eventHub.$on('EndInitMap', (tripColors) => {
      for (let i = 0; i < tripsdata.length; i++) {
        this.trips[i].color = tripColors[tripsdata[i].id]
        if (tripsdata[i].visible === false) {
          this.$eventHub.$emit('hideTrip', tripsdata[i].id, true)
        }
      }
      this.updateColor()
    })
  },
  beforeDestroy () {
    this.$eventHub.$off('markerAdded')
    this.$eventHub.$off('UdaptedMarker')
    this.$eventHub.$off('DoneDeleteMarker')
    this.$eventHub.$off('EndInitMap')
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.trips-box {
  max-height: 300px;
  overflow: auto;
}

</style>
