<template>
  
  <q-page class="flex flex-center">
    <!--<<CustomToolBar />q-toolbar class="bg-primary text-white q-my-md shadow-2">
    </q-toolbar><p>wonder if this would show? yup</p>-->
    

    <img
      alt="Dac logo"
      src="~assets/dac-O-dac-logo.svg"
      style="width: 200px; height: 200px"
    >
    
  </q-page>
</template>

<script>
import { defineComponent,defineAsyncComponent, ref } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'IndexPage',
  components:{
    //CustomToolBar: defineAsyncComponent(() => import('../components/customToolBar.vue')), //loadOnDemand
  },
  props:{
    someProp: String  //default: ''
  },
  data () {
    const $q = useQuasar()
    
    return {
      loggedAs:ref(null),
    }
  }

})
</script>
<style scoped lang="sass">

</style>
