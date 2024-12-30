<template>
      <q-toolbar class="text-white shadow-3"><!--bg-primary -->
        <q-btn flat round dense icon="menu" class="q-mr-sm" />
        <q-separator dark vertical inset />
        <q-toolbar-title class="g-planner">
          Dac Web-UI {{ loggedAs }}
        </q-toolbar-title>
  
        <q-space />
        
        <q-btn v-if="loggedAs"
            class="q-mt-sm main-view doBounce"
            text-color="gold"
            unelevated
            label="Logout"
            no-caps
            no-wrap
            @click="loginBtnClick"
          />
        <q-btn-dropdown v-else stretch flat label="Login">
          <q-list>
            <q-item-label header>Login as</q-item-label>
            <q-item v-for="e in loginOptions" 
              :key="e.title" 
              clickable
              :to="e.link"
              @click="onSelect(e.title)" v-close-popup>
                  <q-item-section>
                      <q-item-label>{{ e.title }}</q-item-label>
                  </q-item-section>
              </q-item>
            <q-separator inset spaced />
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CustomToolBar',
  props: {
    loginOptions: Array,
    loggedAs: String,
    //doEnable: Boolean,
  },
  emits: [
    'LoginAs'
  ],
  mounted() {
    console.log("mounted::",this.loggedAs)
  },
  methods: {
    onSelect(v) {
      console.log('huh login as', v)
      this.$emit('LoginAs', v)
    },
    loginBtnClick(){
      //if(!this.loggedAs) {this.showLoginDialog = true}
      //this.loggedAs = null
      //this.$router.push('/about'); // navigate to the "about" route
      //this.$router.replace({ name: '' }); // replace the current route with the "about" route
      // //both good but can go back....toReview**
      this.$router.push('/');
    },
  }
})
</script>