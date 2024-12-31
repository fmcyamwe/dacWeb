<template>
    <q-page><!--class="flex flex-center"-->
      <div class="flex flex-center"> <h5> List of Doctors</h5></div>

      <div class="q-pa-md bg-grey-9 text-white">
        <q-list v-if="allDoctors && allDoctors.length > 0" class="rounded-borders" separator style="max-width: 600px"><!--bordered dark separator -->
          <q-item-label header>Select doctor for visit </q-item-label>

          <q-item v-for="doctor in allDoctors"
          :key="doctor.Id" 
          clickable v-ripple
          to="/" @click="(evt, go)=>goToDoctor(evt, go, doctor.Id)"
          class="q-my-sm">
            <q-item-section top>
              <q-item-label overline class="q-mx-lg q-px-md row justify-center no-wrap" style="max-width:100%;font-weight: bolder;">
                {{ doctor.speciality }}
              </q-item-label>
            </q-item-section>

            <q-item-section><!--top?-->
              <q-item-label overline>
                {{ doctor.firstName }} {{ doctor.lastName }}
              </q-item-label>
            </q-item-section>

            <q-item-section top side><!--could be icons instead-->
              <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                <span class="cursor-pointer">Request visit</span>
              </q-item-label>
            </q-item-section>

            <q-separator spaced />
          </q-item>
        </q-list>
      </div> 
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
    props:{
      loggedAs: String,//needed? toRemove**
      patientId: {
        type: String,
        //required: true, //should be passed from login...toEnable**
        default: '3a7b5e7a296d'  //for testing...
      }  
    },
    data () {
      const $q = useQuasar()
      
      return {
        //loggedAs:ref(null),
        allDoctors:ref(null)
      }
    },
    mounted(){
      console.log("mounted::", this.patientId) //this.loggedAs
    },
    beforeMount(){
      this.doApiCheck();
    },
    methods: {
      doApiCheck(){
        api.get('/doctors')  //patients should see doctors //patients  
        .then((response) => {
          console.log("response::",response.data)
          this.allDoctors = response.data 
        }).catch(() => {
          //this.notifyError()
          console.log("Error::",response.data)
        })
      },
      requestVisit(id){
        const params = {
          "doctorId": id,
          //"date": "2024-12-28T10:00:00",
          "reason": "Routine check-up", ///todo add in form from Patient?
          "action":"visit"
        }
        
        const url = `/patients/${this.patientId}/requests`
        console.log("requestVisit::",url, params)

        api.post(url,params)
        .then((response) => {
          console.log("requestVisit::response",response.data)
          //this.allDoctors = response.data 
        }).catch((error) => {
          //this.notifyError()
          console.log("requestVisit::Error",error)
        })
      },
      goToDoctor(e, go, id) {
        e.preventDefault() // mandatory; we choose when we navigate

        //console.log("goToDoctor::",e, id)

        this.requestVisit(id)

        // call this at your convenience
        /*go({
          to: '/start/pick-quasar-flavour' // we pick another route
          // replace: boolean; default is what the tab is configured with
          // returnRouterError: boolean
        }).then(_vueRouterResult => {  }) //
          .catch(_vueRouterError => {
            // ...will not reach here unless returnRouterError === true 
          })
        */
      }
    }
  })
  </script>
  <style scoped lang="sass">
  
  </style>
  