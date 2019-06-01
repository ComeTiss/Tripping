<template>
  <div>
    <mapbox
    access-token="pk.eyJ1IjoidGltdmFuMzMiLCJhIjoiY2pyd2hiMjEwMGJrNDN5bzV0aHhhMGxjeSJ9.0YohIMJKD-_Ed9Alwu-P-A"
    :map-options="{
      style: 'mapbox://styles/timvan33/cjw3fwb5o0yjd1cqnsnc2lgtz',
      center: [2.5879, 51.4545],
      zoom: 3,
      pitchWithRotate: false,
      dragRotate: false,
      touchZoomRotate: false,
    }"
    :nav-control="{
      show: false
    }"
    @map-load="mapLoaded"
    @map-click="mapClicked"
    @map-sourcedata="mapSourceChanged"
    @clicked="mapSourceChanged"
    @map-clicked="mapSourceChanged"
    >
    </mapbox>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue'
import Vue from 'vue'
import Popup from '@/components/Popup.vue'
import DestinationService from '@/services/DestinationService.js'
export default {
  components: {
    Mapbox,
    Popup
  },
  data: function () {
    return {
      tripId: null,
      pointerState: 'select',
      path: {},
      tripDeleted: null,
      layerVisibility: {},
      color: {}
    }
  },
  methods: {
    mapSourceChanged (map) {
      // TODO is this updating too much?? reseting source / data ALOT
      let keys = Object.keys(this.path)
      if (keys.length !== 0) {
        keys.forEach(tripId => {
          map.getSource('path' + tripId).setData(this.path[tripId].source.data)
          map.setLayoutProperty('path' + tripId, 'visibility', this.layerVisibility[tripId])
        })
      }

      if (this.tripDeleted !== null) {
        map.removeLayer('path' + this.tripDeleted)
        this.tripDeleted = null
      }
    },
    async mapLoaded (map) {
      // eslint-disable-next-line
      var nav = new mapboxgl.NavigationControl({showCompass: false})
      map.addControl(nav, 'bottom-right')

      const userId = this.$store.state.user.id
      const markers = await DestinationService.getDestinationsByAuthor(userId)
      let tripId = null
      markers.data.destinations.forEach(d => {
        if (tripId !== d.tripId) {
          tripId = d.tripId
          this.newTrip(map, tripId)
        }
        let coord = [d.longCoord, d.latCoord]
        // eslint-disable-next-line
        this.addMarkerToMap(map, mapboxgl.LngLat.convert(coord), d.id, d.tripId)
      })

      this.$eventHub.$emit('EndInitMap', this.color)
    },
    newTrip (map, tripId) {
      this.addLine(map, tripId)
      this.color[tripId] = '#' + Math.floor(Math.random() * 16777215).toString(16)
    },
    addMarkerToMap (map, lngLat, id, tripId) {
      // TODO need to fix bug that line doesn't autodraw
      if (this.path[tripId] === undefined) this.newTrip(map, tripId)
      let numMarkers = this.path[tripId].source.data.geometry.coordinates.length

      // eslint-disable-next-line
      let marker = new mapboxgl.Marker({
        draggable: true,
        color: this.color[tripId]
      }).setLngLat(lngLat).addTo(map)
      marker.getElement().setAttribute('destinationId', id)
      marker.getElement().setAttribute('destinationIndex', numMarkers)
      marker.getElement().setAttribute('tripId', tripId)
      marker.on('dragend', e => {
        this.markerDragEnd(marker, e)
      })
      marker.on('drag', e => {
        this.markerDrag(map, marker, e)
      })

      // -------- LINE ----------- //
      let longCoord = lngLat.toArray()[0]
      let latCoord = lngLat.toArray()[1]
      this.path[tripId].source.data.geometry.coordinates.push([longCoord, latCoord])
      map.getSource('path' + tripId).setData(this.path[tripId].source.data)

      // -------- POPUP ----------- //
      // eslint-disable-next-line
      let popup = new mapboxgl.Popup({offset: 25})
        .setHTML('<div id="vue-popup-content"></div>')
      popup.on('open', e => {
        this.popupOpen(popup, e, id)
      })
      marker.setPopup(popup)
    },
    async popupOpen (popup, e, id) {
      let res = await DestinationService.getDestination(id)
      let PopupClass = Vue.extend(Popup)
      let popupContent = new PopupClass()
      popupContent.$data.title = res.data.title
      popupContent.$data.content = res.data.content
      popupContent.$data.edit = false
      popupContent.$data.destinationId = id
      popupContent.$mount('#vue-popup-content')

      popup.on('close', e => {
        popupContent.$data.edit = false
      })
    },
    addLine (map, tripId) {
      // TODO visibility based on prior settings taken from trip
      this.layerVisibility[tripId] = 'visible'
      this.path[tripId] = {
        'id': 'path' + tripId,
        'type': 'line',
        'source': {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'geometry': {
              'type': 'LineString',
              'coordinates': []
            },
            'properties': {}
          }
        },
        'layout': {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': 'visible'
        },
        'paint': {
          'line-color': '#888',
          'line-width': 8
        }
      }
      map.addLayer(this.path[tripId])
    },
    async mapClicked (map, e) {
      // TODO: should this be async or create new function for async part
      // TODO new destination should have trip id
      if (this.pointerState === 'newMarker') {
        var destination = await this.postNewMarker(map, e)

        // TODO: should have some async await protection here to stop duplications if fails before add new marker to map
        this.addMarkerToMap(map, e.lngLat, destination.id, destination.tripId)
        const data = {
          destination: destination,
          color: this.color[destination.tripId]
        }
        this.$eventHub.$emit('markerAdded', data)
        this.pointerState = 'select'
      }
    },
    async postNewMarker (map, e) {
      const authorId = this.$store.state.user.id

      let newMarker = {
        title: 'New destination',
        content: '',
        tripId: this.tripId,
        authorId: authorId,
        longCoord: e.lngLat.toArray()[0],
        latCoord: e.lngLat.toArray()[1],
        icon: 'default'
      }
      let res = await DestinationService.postDestination(newMarker)
      return res.data.destination
    },
    markerDragEnd (marker, e) {
      let destinationId = marker.getElement().getAttribute('destinationId')
      let data = {
        longCoord: marker.getLngLat().toArray()[0],
        latCoord: marker.getLngLat().toArray()[1]
      }
      DestinationService.patchDestination(destinationId, data)
    },
    markerDrag (map, marker, e) {
      let destinationIndex = marker.getElement().getAttribute('destinationIndex')
      let longCoord = marker.getLngLat().toArray()[0]
      let latCoord = marker.getLngLat().toArray()[1]
      let tripId = marker.getElement().getAttribute('tripId')
      this.path[tripId].source.data.geometry.coordinates[destinationIndex] = [longCoord, latCoord]
      map.getSource('path' + tripId).setData(this.path[tripId].source.data)
    },
    deleteMarker (destinationId) {
      let marker = document.querySelector('[destinationId="' + destinationId + '"]')
      let destinationIndex = marker.getAttribute('destinationIndex')
      let tripId = marker.getAttribute('tripId')
      // delete the item from the path
      this.path[tripId].source.data.geometry.coordinates.splice(destinationIndex, 1)
      // delete html marker
      marker.parentNode.removeChild(marker)

      // reorder item number of each marker for the paths
      let markers = document.querySelectorAll('[tripId="' + tripId + '"]')
      let cur = 0
      markers.forEach(m => {
        if ((cur = m.getAttribute('destinationIndex')) > destinationIndex) {
          m.setAttribute('destinationIndex', parseInt(cur) - 1)
        }
      })
    },
    deleteTrip (tripId) {
      let markers = document.querySelectorAll('[tripId="' + tripId + '"]')
      markers.forEach(m => {
        m.parentNode.removeChild(m)
      })
      // delete path
      for (let i = 0; i < this.path.length; i++) {
        if (this.path[i].id === 'path' + tripId) {
          this.path.splice(i, 1)
        }
      }
      this.tripDeleted = tripId
    },
    hideTrip (tripId, makeHidden) {
      let style = 'visible'
      if (makeHidden === true) style = 'hidden'

      let markers = document.querySelectorAll('[tripId="' + tripId + '"]')
      markers.forEach(m => {
        m.style.visibility = style
      })

      if (makeHidden === true) style = 'none'
      this.layerVisibility[tripId] = style
    }
  },
  mounted () {
    this.$eventHub.$on('deleteMarker', (destinationId) => {
      this.deleteMarker(destinationId)
    })
    this.$eventHub.$on('newMarker', (tripId) => {
      this.tripId = tripId
      this.pointerState = 'newMarker'
    })
    this.$eventHub.$on('deleteTrip', (tripId) => {
      this.deleteTrip(tripId)
    })
    this.$eventHub.$on('hideTrip', (tripId, makeHidden) => {
      this.hideTrip(tripId, makeHidden)
    })
  },
  beforeDestroy () {
    this.$eventHub.$off('deleteMarker')
    this.$eventHub.$off('newMarker')
    this.$eventHub.$off('deleteTrip')
    this.$eventHub.$off('hideTrip')
  }
}

</script>

<style scoped>

@import "https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.1/mapbox-gl.css";

#map {
  position: absolute;
  text-align:justify;
  top: 0;
  bottom: 0;
  width: 100%;
}

</style>
