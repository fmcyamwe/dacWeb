<template>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated reveal :revealOffset="100" :class="theme">
        <div class="q-pa-md">
          <q-toolbar class="bg-purple text-white shadow-2 rounded-borders">
            <q-btn flat label="Homepage" @click="onClicked"/>
            <q-space />

            <!--
              notice shrink property since we are placing it
              as child of QToolbar
            also move into AdminPage instead smh-->
            <q-tabs v-model="tab" shrink>
              <q-tab name="Add" label="Add" no-caps/>
              <q-tab name="View" label="View" no-caps/>
              <q-tab name="Other" label="Other" no-caps/>
            </q-tabs>
          </q-toolbar>
      </div>
      </q-header>
  
      <q-page-container>
        <q-tab-panels v-model="tab" animated><!--huh wonder if can use-->
          <q-tab-panel name="Add">

          </q-tab-panel>
          <q-tab-panel name="View">
            <ViewInfo/>
          </q-tab-panel>
          <q-tab-panel name="Other">

          </q-tab-panel>
        </q-tab-panels><!--so bad-->

        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </q-page-container>
    </q-layout>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
import ViewInfo from '../components/ViewInfo.vue'

export default defineComponent({
  name: 'AdminLayout',

  components: {
    ViewInfo
    //CustomToolBar: defineAsyncComponent(() => import('../components/customToolBar.vue')),
  },
  props:{
    loggedAs:{
      type: String,
      default: ''
    }
  },
  setup () {
    const $q = useQuasar()
    //console.log($q.platform.is) //.ios

    return {
      tab:ref('Add'),
      showNavbar: true,
      lastScrollPosition: 0,
      isConnected:ref(false), //check connection before showing login btn...
    }
  },
  beforeMount(){
    //this.doApiCheck();
    console.log("beforeMount::AdminLayout")
  },
  mounted(){
      console.log("mounted::",this.loggedAs)
  },
  
  beforeUnmount(){
    //window.removeEventListener('scroll', this.onScroll)
  },
  computed: {
    theme(){
      if(!this.loggedAs) return;

      return this.loggedAs == 'Doctor' ? "doctorTheme" : "patientTheme"
    },
  },
  methods: {
    onClicked(){
      //this.loggedAs = null
      //this.$router.push('/about'); // navigate to the "about" route
      //this.$router.replace({ name: '' }); // replace the current route with the "about" route
      // //both good but can go back....toReview**
      this.$router.push('/');
    },
    onScroll () {
      // Get the current scroll position
      const currentScrollPosition = window.scrollY || document.documentElement.scrollTop
      // Because of momentum scrolling on mobiles, we shouldn't continue if it is less than zero
      if (currentScrollPosition < 0) {
        return
      }
      // Here we determine whether we need to show or hide the navbar
      this.showNavbar = currentScrollPosition < this.lastScrollPosition
      // Set the current scroll position as the last scroll position
      this.lastScrollPosition = currentScrollPosition
    },
    doApiCheck(){
      api.get('/connect') //toChange....
      .then((response) => {
        console.log("response::",response.data)
        this.isConnected = true 
      }).catch(() => {
        this.notifyError()
      })
    }, 
    notifyError(){
      this.$q.notify({
        color: 'negative',
        position: 'top',
        message: 'API connection failed',
        icon: 'report_problem'
        })
    },
  }
})
</script>
<style scoped lang="sass">
.patientTheme
  background-color: green

.doctorTheme
  background-color: red
</style>