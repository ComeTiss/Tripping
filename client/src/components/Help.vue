<template>
  <v-flex xs8 offset-xs3 mt-5>
    <panel title="Help Page">

      <v-container grid-list-md text-xs-left>
        <v-layout row wrap>

          <v-flex xs4>
            <v-card>
              <v-img src="/static/help2.png"></v-img>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">Create a new trip</h3>
                  <div></div>
                </div>
              </v-card-title>
            </v-card>
          </v-flex>

          <v-flex xs4>
            <v-card>
              <v-img src="/static/help3.png"></v-img>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">Use the trip panel to</h3>
                  <div></div>
                  <ul>
                    <li>Go to detailed trip view</li>
                    <li>Create new destination markers</li>
                    <li>Delete trip</li>
                    <li>Make the trip visible</li>
                  </ul>
                </div>
              </v-card-title>
            </v-card>
          </v-flex>

          <v-flex xs4 s6>
            <v-card>
              <v-img src="/static/help1.png"></v-img>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">Plan your next trip</h3>
                  <div></div>
                  <div></div>
                  <ul>
                    <li>Create new markers in the trip panel</li>
                    <li>Drag markers into place</li>
                    <li>Click them to change content</li>
                  </ul>
                </div>
              </v-card-title>
            </v-card>
          </v-flex>

        </v-layout>
      </v-container>
    </panel>
  </v-flex>
</template>

<script>
import Panel from '@/components/Panel'
export default {
  components: {
    Panel
  }
}
</script>

<style scoped>
</style>
