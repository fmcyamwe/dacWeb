<template>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated reveal :revealOffset="100" :class="theme">
        <CustomToolBar
            class="q-mt-sm main-view doBounce"
            :login-options="[]"
            :logged-as="loggedAs"
            @login-as="() => {console.log('umm wanna log out?')}"
        />
        <br>
      </q-header>
  
      <q-page-container>
        
        <!--<router-view some-prop="a value"/> -->
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
//import { dacOdacStore } from '../stores/dacOdac' 
//import { useDacStore } from '../stores/dac-store' 

export default defineComponent({
  name: 'ViewLayout',

  components: {
    CustomToolBar: defineAsyncComponent(() => import('../components/customToolBar.vue')),
  },
  props:{
    loggedAs:{
        type: String,
        default: '' //Patient
    }
  },
  setup () {
    const $q = useQuasar()
    //console.log($q.platform.is) //.ios
    //const dacOStore = dacOdacStore()
    //const dacStore = useDacStore()

    return {
      //loginList: loginOptionList,
      showNavbar: true,
      lastScrollPosition: 0,
      isConnected:ref(false), //check connection before showing login btn...
      showLoginDialog:ref(false),
      //dacOStore: dacOdacStore(),
      //apiToken:ref(null),
      //loggedIn:this.loggedAs//ref(this.loggedAs),
    }
  },
  /*beforeMount(){
    let token = this.dacOStore.getToken
    console.log("beforeMount::ViewLayout",this.loggedAs, token)
    if(!token){
      let t = this.getToken()
      console.log("beforeMount::ViewLayout >> getToken",t) //toSee**
      //this.apiToken = t ///rprolly
    }
  },*/
  //mounted(){
  //    console.log("mounted::ViewLayout",this.loggedAs)
  //},
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
    loginBtnClick(){ //redundant--toRemove**
      if(!this.loggedAs) {this.showLoginDialog = true}
      //this.loggedAs = null
      //this.$router.push('/about'); // navigate to the "about" route
      //this.$router.replace({ name: '' }); // replace the current route with the "about" route
      // //both good but can go back....toReview**
      this.$router.push('/');
    },
    doLogin(choice){ //redundant--toRemove**
      console.log("loginAs", choice)
      //this.loggedAs = choice  
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
    getToken(){  //redundant--toRemove**
      const params = {
        "username": "admin", //toChange
        "password":"password"
      }
        
        const url = `/auth/login`
        console.log("getToken::",url, params)
        api.post(url,params)
        .then((response) => {
          console.log("getToken::response",response.data)
          //this.allDoctors = response.data 
          //this.dacStore.saveToken(response.data.token)
          this.dacOStore.saveToken(response.data.token)
          return response.data.token
        }).catch((error) => {
          //this.notifyError()
          console.log("getToken::Error",error)
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
.patientTheme
  background-color: green

.doctorTheme
  background-color: red
</style>