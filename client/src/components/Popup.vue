<template>
  <div id="vue-popup-content">
    <div v-if="edit">
      <form>
        <v-text-field
          v-model="title"
        >
        </v-text-field>
        <v-textarea
          solo
          v-model="content"
        >
        </v-textarea>
        <v-btn @click="save">save</v-btn>
        <v-btn @click="cancel">cancel</v-btn>
      </form>
    </div>
    <div v-else>
      <h3 id="popup-title">{{ title }}</h3>
      <span style="white-space: pre-line">
        <p id="popup-content">{{ content }}</p>
      </span>
      <v-btn icon small>
        <v-icon
          v-on:click="goToForm"
          >
          edit
        </v-icon>
      </v-btn>
      <v-btn icon small @click="deleteMarker">
        <v-icon>
          delete_forever
        </v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import DestinationService from '@/services/DestinationService.js'
export default {
  data: function () {
    return {
      title: 'Title',
      title_prev: '',
      content: 'Content',
      content_prev: '',
      edit: false,
      destinationId: null
    }
  },
  methods: {
    goToForm () {
      this.edit = true
      this.title_prev = this.title
      this.content_prev = this.content
    },
    save () {
      var title = this.title
      var content = this.content
      var data = {
        title: title,
        content: content
      }
      DestinationService.patchDestination(this.destinationId, data)
      this.edit = false

      const markerData = {
        id: this.destinationId,
        data: data
      }
      this.$eventHub.emit('UdaptedMarker', markerData)
    },
    cancel () {
      this.edit = false
      this.title = this.title_prev
      this.content = this.content_prev
    },
    async deleteMarker () {
      const destinationId = this.destinationId
      this.$eventHub.$emit('deleteMarker', destinationId)
      await DestinationService.deleteDestination(destinationId)
      this.$eventHub.$emit('DoneDeleteMarker', destinationId)
      // close popUp
      let elem = document.querySelector('.mapboxgl-popup')
      elem.parentNode.removeChild(elem)
    }
  }
}
</script>

<style scoped>

#vue-popup-content {
  width: 300px;
}

</style>
