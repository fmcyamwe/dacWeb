<template>
  <q-page class="flex flex-center">
    
    <loginDialog v-if="loggedInAs"
      :randomLogAcct="selectLoginAcct"
      @do-login-as="doLogin"
      @gon-hide="(e) =>{ console.log('do something?'); }"
      /><!--umm above dont run?!?-->

    <img
      alt="Dac logo"
      src="~assets/dac-O-dac-logo.svg"
      style="width: 200px; height: 200px"
    >
    
  </q-page>
</template>

<script>
import { defineComponent,defineAsyncComponent, ref,watch } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'IndexPage',
  components:{
    loginDialog: defineAsyncComponent(() => import('../components/loginDialog.vue'))//loadOnDemand
  },
  props:{
    loggedInAs: String,  //default: ''
    randoms: Array
    //loggedAs >> pass in? 
  },
  data () {
    const $q = useQuasar()
    //const apiToken = ref(this.loggedInAs)

    /* umm not needed with using ref() above! also just had to pass it from router for proper update!!
    watch(apiToken,(someProppy, prevSomeProp) => {
      console.log("IndexPage::watch::someProp",someProppy, prevSomeProp)
      if(someProppy){
        //this.fetchAllPatients(apiTokn)this.loggedInAs
        //this.loggedAs = someProppy //no likey this.
      }
    })*/

    return {
      //loggedAs:ref(null),
      someProps:this.someProp,
      //randoms:
    }
  },
  mounted(){
    console.log("IndexPage::mounted", this.loggedInAs, this.randoms)
  },
  computed:{
    selectLoginAcct(){
      console.log("IndexPage:: selectLoginAcct", this.randoms)
      return this.loggedInAs == 'Doctor' ? this.randoms[0] : this.randoms[1]
    },
  },
  methods: {
    doLogin(userName, pwd){ //actual route change
      console.log("IndexPage::doLogin", this.loggedInAs, userName, pwd)
      var route = this.loggedInAs == 'Doctor' ? '/doctor/'+userName : '/patient/'+userName //this.randoms[0] :this.randoms[1]
      //this.loggedAs = choice  
      this.$router.push({ path: route })  //`/user/${username}`
    },
    /*selectLoginAcct(){//proper dynamic eval but not needed with using computed above
      //todo** validation that this.randoms != null
      console.log("IndexPage:: selectLoginAcct", this.randoms)
      return this.loggedInAs == 'Doctor' ? this.randoms[0] : this.randoms[1]
    },*/

  }
})
</script>
<style scoped lang="sass">

</style>
