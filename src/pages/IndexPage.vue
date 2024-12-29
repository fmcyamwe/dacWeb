<template>
  <q-page class="flex flex-center daImage">
    <img
      alt="Dac logo"
      src="~assets/dac-O-dac-logo.svg"
      style="width: 200px; height: 200px"
    >
    
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'IndexPage',
  components:{
    //LoginDropDown: defineAsyncComponent(() => import('../components/loginDropDown.vue')), //loadOnDemand
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
