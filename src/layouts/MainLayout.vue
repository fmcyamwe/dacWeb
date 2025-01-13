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
import { api } from 'boot/axios'
import { anotherApiCheck,doApiCheck } from '../pages/util/apiHelper'

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
    logoutBtnClick(){ //todo** should handle route change here 
      if(!this.loggedAs) {this.showLoginDialog = true}
      this.loggedAs = null
      //this.$router.push('/about'); // navigate to the "about" route
      //this.$router.replace({ name: '' }); // replace the current route with the "about" route
      // //both good but can go back....toReview**
      this.$router.push('/');
    },
    /*selectLoginAcct(){//proper dynamic eval
      //todo** validation that this.randoms != null
      return this.loggedAs == 'Doctor' ? this.randoms[0] : this.randoms[1]
    },*/
    showLogin(choice){
      console.log("showLogin::loginAs", choice, this.randoms)
      //show login dialog....also handle when this.randoms === null --todo**
      this.loggedAs = choice  
    },
    /*doLogin(userName, pwd){ //actual route change
      console.log("doLogin", this.loggedAs, userName, pwd)
      var route = this.loggedAs == 'Doctor' ? '/doctor/'+userName : '/patient/'+userName //this.randoms[0] :this.randoms[1]
      //this.loggedAs = choice  
      this.$router.push({ path: route })  //`/user/${username}`
    },*/
    onScroll () {//redundant--toRemove**
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
    doAnApiCheck(){
      //let a = 
      doApiCheck().then((response) => {
        console.log("doAnApiCheck::response>> ",response.data)
        this.isConnected = true
        this.randoms = response.data
      }).catch((error) => {
        console.log("doAnApiCheck::Error",error)
        //this.notifyError() //needed Notify plugin
      })

      /*
      api.get('/connect') //toChange....
      .then((response) => {
        console.log("doApiCheck::response>> ",response.data)
        this.isConnected = true
        this.randoms = response.data
      }).catch((error) => {
        console.log("getToken::Error",error)
        this.notifyError() //needed Notify plugin
      })*/
    },
    /*getToken() {
      const params = {
        "username": "admin", //toChange
        "password":"password"
      }
        
      const url = `/auth/login`
        //console.log("getToken::",url, params)
        
        //would below work? or manually set them?
        //api.defaults.headers.common['Authorization'] = AUTH_TOKEN;
        
      api.post(url,params)
        .then((response) => {
          console.log("getToken::response",response.data)
          //this.dacStore.saveToken(response.data.token)
          this.dacOStore.saveToken(response.data.token)
          this.apiToken = response.data.token
          //console.log(response.status);
          //console.log(response.statusText);
          console.log(response.headers);
          console.log(response.config);
        }).catch((error) => {
          //this.notifyError()
          console.log("getToken::Error",error)
        })
      },*/
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
