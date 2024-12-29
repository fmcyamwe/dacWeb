<template>
    <q-page class="flex flex-center daImage">
      <!--<img
        alt="Dac logo"
        src="~assets/dac-O-dac-logo.svg"
        style="width: 200px; height: 200px"
      >-->
      <q-list bordered v-if="allPatients && allPatients.length > 0">
        <q-item v-for="patient in allPatients"
        :key="patient.Id" 
        class="q-my-sm">
          <q-item-section>
            <q-item-label overline class="q-mx-lg q-px-md row justify-center no-wrap" style="max-width:100%;font-weight: bolder;">
            {{ patient.firstName }} {{ patient.lastName }}
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
    name: 'PatientPage',
    components:{
      //LoginDropDown: defineAsyncComponent(() => import('../components/loginDropDown.vue')), //loadOnDemand
    },
    data () {
      const $q = useQuasar()
      
      return {
        //loggedAs:ref(null),
        allPatients:ref(null)
      }
    },
    beforeMount(){
      this.doApiCheck();
    },
    methods: {
      doApiCheck(){
        api.get('/patients')
        .then((response) => {
          console.log("response::",response.data)
          this.allPatients = response.data 
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
  