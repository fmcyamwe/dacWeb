<template>
    <q-page class="flex flex-center daImage">
      <img
        alt="Dac logo"
        src="~assets/dac-O-dac-logo.svg"
        style="width: 200px; height: 200px"
      >
      <q-list bordered v-if="allDoctors && allDoctors.length > 0">
        <q-item v-for="doctor in allDoctors"
        :key="doctor.Id" 
        class="q-my-sm">
          <q-item-section>
            <q-item-label overline class="q-mx-lg q-px-md row justify-center no-wrap" style="max-width:100%;font-weight: bolder;">
            {{ doctor.firstName }} {{ doctor.lastName }}
            </q-item-label>
          </q-item-section>
          <q-separator spaced />
        </q-item>
      </q-list>
      
    </q-page>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue'
  import { useQuasar } from 'quasar'
  import { api } from 'boot/axios'
  
  export default defineComponent({
    name: 'DoctorPage',
    components:{
      //LoginDropDown: defineAsyncComponent(() => import('../components/loginDropDown.vue')), //loadOnDemand
    },
    data () {
      const $q = useQuasar()
      
      return {
        //loggedAs:ref(null),
        allDoctors:ref(null)
      }
    },
    beforeMount(){
      this.doApiCheck();
    },
    methods: {
      doApiCheck(){
        api.get('/doctors')
        .then((response) => {
          console.log("response::",response.data)
          this.allDoctors = response.data 
        }).catch(() => {
          //this.notifyError()
          console.log("Error::",response.data)
        })
      }, 
    }
  })
  </script>
  <style scoped lang="sass">
  
  </style>
  