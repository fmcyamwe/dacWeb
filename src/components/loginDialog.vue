<template>
  <q-dialog v-model="showDialog" transition-show="rotate" transition-hide="rotate" no-esc-dismiss @before-hide="$emit('gonHide')">
    <q-card>
      <!--<div class="text-h6 q-mx-xs">Login As </div>-->
      <q-btn-dropdown
      color=""
      text-color="teal"
      elevated
      no-caps
      label="Login As"
      ><!--@click="onClicked"-->
          <q-list>
              <q-item v-for="e in loginOptions" 
              :key="e.title" 
              clickable
              :to="e.link"
              @click="onSelect(e.title)" v-close-popup>
                  <q-item-section>
                      <q-item-label>{{ e.title }}</q-item-label>
                  </q-item-section>
              </q-item>
          </q-list>
      </q-btn-dropdown>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent,ref } from 'vue'

//const loginOptions = ["Patient", "Doctor"]

export default defineComponent ({
  name: 'loginDialog',
  props: {
    //showDefaultOption: Boolean //umm point of this?  //v-model="showDefaultOption" 
    loginOptions: Array 
  },
  setup () {
    return {
      //options: loginOptions,
      show:ref(true), //for default dialog show/hide//true by default...
    }
  },
  emits: [
    'doLoginAs',
    'gonHide'
  ],
  /*mounted(){ //beforeMount
    console.log('huh login as', this.loginOptions)
  },*/
  computed: {
    showDialog:{
        get(){return this.show},
        set(value){
            this.show = value
        }
    },
  },
  methods: {
    //onClicked () {
    //  this.$emit('doLogin')
    //},
    onSelect(v) {
      console.log('huh login as', v)
      this.$emit('doLoginAs', v)
    }
  }
})
</script>