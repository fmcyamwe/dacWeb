<template>
  <q-page class="flex flex-center">
    
    <loginDialog v-if="loggedInAs"
      :randomLogAcct="selectLoginAcct"
      @do-login-as="doLogin"
      @gon-hide="(e) =>{ console.log('do something?'); }"
    />

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
  }
})
</script>
<style scoped lang="sass">

</style>
