<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated reveal :revealOffset="100">
      <q-toolbar><!--class="navbar"
        :class="{ 'navbar--hidden': !showNavbar }"
        @click.prevent="clicked"
        -->
        <q-toolbar-title class="g-planner">
          Dac Web-UI
        </q-toolbar-title>

        <!--  class="q-mt-xl"-->
      <div class="text-white">
        <q-btn v-if="isConnected"
            class="q-mt-sm main-view doBounce"
            text-color="gold"
            unelevated
            label="Login"
            no-caps
            no-wrap
        />
      </div>

      <div class="row justify-center">
        <!--<EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />@reset="clicky"-->
      </div>
      </q-toolbar>
      <br>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios'
//import EssentialLink from 'components/EssentialLink.vue'

/*const linksList = [
  {
    title: 'Goals',
    caption: 'All Goals',
    icon: 'edit_note',
    link: '/goalsPage', 
  },
  {
    title: 'Day View',
    caption: 'Schedule',
    icon: 'self_improvement', //event_upcoming || //today
    link: '/dayCalendar',
  },
  {
    title: 'Summary',
    caption: 'Summary',
    icon: 'summarize', //self_improvement ?
    link: '/summary', //'https://quasar.dev'
  },
  //{
  //  title: 'Testy',
  //  caption: 'Testy',
  //  icon: 'event_upcoming',
  //  link: '/testy',
  //}
]*/

export default {
  name: 'MainLayout',

  //components: {
  //  EssentialLink
  //},

  setup () {
    const $q = useQuasar()
    console.log($q.platform.is) //.ios

    return {
      //essentialLinks: linksList,
      showNavbar: true,
      lastScrollPosition: 0,
      isConnected:ref(false) //check connection before showing login btn...
    }
  },
  beforeMount(){
    this.doApiCheck();
  },
  //mounted(){
  //  console.log("onMounted")
    //window.addEventListener('scroll', this.onScroll)
  //},
  beforeUnmount(){
    //window.removeEventListener('scroll', this.onScroll)
  },
  methods:{
    clicked(){
      console.log("clicked")
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
      console.log("doApiCheck")
      api.get('/patients') //toChange....
      .then((response) => {
        console.log("response::",response.data)
        this.isConnected = true 
      }).catch(() => {
        this.notifyError()
      })
    }, 
    notifyError(){
      $q.notify({
        color: 'negative',
        position: 'top',
        message: 'API connection failed',
        icon: 'report_problem'
        })
    },
  }
}
</script>
<style scoped lang="sass">
.g-planner
  padding: 0 1.5em 0 1.5em
.navbar
  height: 60px
  width: 100vw
  background: hsl(200, 50%, 50%)
  position: fixed
  box-shadow: 0 2px 15px rgba(71, 120, 120, 0.5)
  transform: translate3d(0, 0, 0)
  transition: 0.1s all ease-out

.navbar.navbar--hidden
  box-shadow: none
  transform: translate3d(0, -100%, 0)

.doBounce
  animation: bounce 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both
  transform: translate3d(0, 0, 0)
  
@keyframes bounce
  10%,
  90%
    transform: translate3d(-1px, 0, 0)
  20%,
  80%
    transform: translate3d(2px, 0, 0)
  30%,
  50%,
  70%
    transform: translate3d(-4px, 0, 0)
  40%,
  60%
    transform: translate3d(4px, 0, 0)

.main-view
  &:active,
  &:visited,
  &.q-btn--active
    &:before
      box-shadow: $button-shadow-active

@media (max-width: 500px)
  .g-planner 
    display: none
  .main-view
    padding: 0 2.5em 0 2.5em
</style>
