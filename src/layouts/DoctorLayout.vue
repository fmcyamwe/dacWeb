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
        
        <!--<router-view :some-prop="a value"/> -->
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

export default defineComponent({
    name: 'DoctorLayout',
  
    components: {
        CustomToolBar: defineAsyncComponent(() => import('../components/customToolBar.vue')),
    },
    props: {
        loggedAs:{
            type: String,
            default: '' //doctor
        }
    },
    setup () {
      const $q = useQuasar()
      //console.log($q.platform.is) //.ios
  
      return {
        //loginList: loginOptionList,
        showNavbar: true,
        lastScrollPosition: 0,
        isConnected:ref(false), //check connection before showing login btn...
        showLoginDialog:ref(false),
        //loggedIn:this.loggedAs
      }
    },
    beforeMount(){
      //this.doApiCheck();
      console.log("beforeMount::DoctorLayout")
    },
    mounted(){
      console.log("mounted::",this.loggedAs)
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