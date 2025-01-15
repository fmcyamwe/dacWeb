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
        default: ''
    }
  },
  setup () {
    const $q = useQuasar()
    return {
     
      isConnected:ref(false),
      showLoginDialog:ref(false),
      //dacOStore: dacOdacStore(),
      //apiToken:ref(null),
      //loggedIn:this.loggedAs//ref(this.loggedAs),
    }
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
    getToken(){  //redundant--toRemove**
      const params = {
        "username": "admin", //toChange
        "password":"password"
      }
        
        const url = `/auth/login`
        console.log("getToken::",url, params)
        api.post(url,params)
        .then((response) => {
          //console.log("getToken::response",response.data)
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