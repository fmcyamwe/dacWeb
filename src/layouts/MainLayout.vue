<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated reveal :revealOffset="100" :class="theme">
      <CustomToolBar v-if="isConnected"
      class="q-mt-sm main-view doBounce"
      :login-options="loginList"
      :logged-as="loggedAs"
      @login-as="doLogin"
      />
      <q-toolbar v-else class="q-mx-lg g-planner">
        <q-toolbar-title >
          Dac Web-UI
        </q-toolbar-title>
        !Connection issues!
        <q-btn
            class="q-mt-sm main-view doBounce"
            text-color="gold"
            unelevated
            label="Try again"
            no-caps
            no-wrap
            @click="doApiCheck" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <!--<router-view  :someProp="loggedAs"/> -->
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

const loginOptionList = [ //bon better to control login Options from here!!
  {
    title: 'Patient',
    caption: 'As Patient',
    icon: 'edit_note',
    link: '/patient',
  },
  {
    title: 'Doctor',
    caption: 'As Doctor',
    icon: 'event_upcoming',
    link: '/doctor',
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    CustomToolBar: defineAsyncComponent(() => import('../components/customToolBar.vue')), //loadOnDemand
  },

  setup () {
    const $q = useQuasar()
    //console.log($q.platform.is) //.ios

    return {
      loginList: loginOptionList,
      showNavbar: true,
      lastScrollPosition: 0,
      isConnected:ref(false), //check connection before showing login btn...
      showLoginDialog:ref(false),
      loggedAs:ref(null),
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
  computed: {
    theme(){
      if(!this.loggedAs) return;

      return this.loggedAs == 'Doctor' ? "doctorTheme" : "patientTheme"
    },
  },
  methods: {
    loginBtnClick(){
      if(!this.loggedAs) {this.showLoginDialog = true}
      this.loggedAs = null
      //this.$router.push('/about'); // navigate to the "about" route
      //this.$router.replace({ name: '' }); // replace the current route with the "about" route
      // //both good but can go back....toReview**
      this.$router.push('/');
    },
    doLogin(choice){
      console.log("loginAs", choice)
      this.loggedAs = choice  
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
        //this.notifyError()
      })
    }, 
    notifyError(){
      this.$q.notify({ //weirdly complains on $q access?
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
.g-planner
  padding: 0 1.5em 0 1.5em

.patientTheme
  background-color: green

.doctorTheme
  background-color: red

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
