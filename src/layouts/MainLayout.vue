<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated reveal :revealOffset="100" :class="theme">
      <CustomToolBar v-if="isConnected"
      class="q-mt-sm main-view doBounce"
      :login-options="loginList"
      :logged-as="loggedAs"
      @login-as="showLogin"
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
            @click="doAnApiCheck" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <!--<router-view  :someProp="loggedAs"/> -->
      
      <router-view v-slot="{ Component }" :loggedInAs="loggedAs" :randoms="randoms">
        <component :is="Component" />
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import { doApiCheck } from '../pages/util/apiHelper'

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
    //loginDialog: defineAsyncComponent(() => import('../components/loginDialog.vue'))
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
      randoms:ref(null)
    }
  },
  beforeMount(){
    this.doAnApiCheck();
  },
  computed: {
    theme(){
      if(!this.loggedAs) return;

      return this.loggedAs == 'Doctor' ? "doctorTheme" : "patientTheme"
    },
  },
  methods: {
    logoutBtnClick(){ //todo** should handle route change here 
      if(!this.loggedAs) {this.showLoginDialog = true}
      this.loggedAs = null
      //this.$router.push('/about'); // navigate to the "about" route
      //this.$router.replace({ name: '' }); // replace the current route with the "about" route
      // //both good but can go back....toReview**
      this.$router.push('/');
    },
    showLogin(choice){
      console.log("showLogin::loginAs", choice, this.randoms)
      //show login dialog....also handle when this.randoms === null --todo**
      this.loggedAs = choice  
    },
    doAnApiCheck(){
      //let a = 
      doApiCheck().then((response) => {
        console.log("doAnApiCheck::response>> ",response.data)
        this.isConnected = true
        this.randoms = response.data
      }).catch((error) => {
        console.log("doAnApiCheck::Error",error)
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
