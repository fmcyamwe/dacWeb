<template>
    <q-page class="flex flex-center">
      
      <!---also get notifications for active requests for visitation & reply to each(with being able to )-->
      <!--<q-list bordered v-if="allDoctors && allDoctors.length > 0">
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
      </q-list> -->
      <!--should see current patients use tab prollly-->
      <q-tabs
      v-model="tab"
      dense
      active-color="primary"
      indicator-color="purple"
      align="justify"
      >
        <q-tab name="RList" label="Requests" />
        <q-tab name="Patients" label="All Patients" />
        <!-- tab to edit own info?-->
        <!--<q-tab name="Admin" label="Admin Stuff" :disable="!enableAdmin"/>-->
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="RList">
          <!-- List of vist requests from Patients-->
          <q-list bordered>
            <q-item v-if="visitRequests && visitRequests.length > 0">
              <q-item-section>
                <q-item-label overline class="q-mx-lg q-px-md row justify-center no-wrap" style="max-width:100%;font-weight: bolder;">
                  Swipe to Edit/Delete Request
                 </q-item-label>
              </q-item-section>
              <q-separator spaced />
            </q-item>
            <!--use transition group to select each request...todo-->
            <q-item v-for="req in visitRequests"
            :key="req.patientId" 
            class="q-my-sm">
              <q-item-section>
                <q-item-label overline class="q-mx-lg q-px-md row justify-center no-wrap" style="max-width:100%;font-weight: bolder;">
                {{ req.reason }} {{ req.action }} {{ req.on }}
                </q-item-label>
              </q-item-section>

              <q-separator spaced />
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="Patients">
          <!-- List of Patients in Doctor's care-->
          <q-list bordered>
            <q-item v-if="allPatients && allPatients.length > 0">
              <q-item-section>
                <q-item-label overline class="q-mx-lg q-px-md row justify-center no-wrap" style="max-width:100%;font-weight: bolder;">
                  Swipe to View more on each Patient
                 </q-item-label>
              </q-item-section>
              <q-separator spaced />
            </q-item>
            
            <q-item v-for="patient in allPatients"
            :key="patient.patientId" 
            class="q-my-sm">
              <q-item-section>
                <q-item-label overline class="q-mx-lg q-px-md row justify-center no-wrap" style="max-width:100%;font-weight: bolder;">
                {{ req.reason }} {{ req.action }} {{ req.on }}
                </q-item-label>
              </q-item-section>
              <q-separator spaced />
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
      
    </q-page>
  </template>
  
  <script>
  import { defineComponent, ref } from 'vue'
  import { useQuasar } from 'quasar'
  import { api } from 'boot/axios'
  
  export default defineComponent({
    name: 'DoctorPage',
    components:{
      
    },
    props:{
      //loggedAs: String //prolly not needed--toReview**
      doctorId: {
        type: String,
        //required: true, //should be passed from login...toEnable**
        default: '266721c1816c'  //for testing...
      } 
    },
    data () {
      const $q = useQuasar()
      
      return {
        //loggedAs:ref(null),
        allPatients:ref(null), //should be current patients 
        //allSpecialities:ref(null),
        visitRequests:ref([]),
        tab:ref('Patients') //start by viewing current patients

      }
    },
    beforeMount(){
      //this.fetchCurrentPatients();
      this.fetchPendingRequests();

    },
    mounted(){
      console.log("mounted::",this.doctorId)
    },
    methods: {
      fetchCurrentPatients(){ 
        const url = `/doctors/${this.doctorId}/patients`
        api.get(url) //should actually be patients --todo**
        .then((response) => {
          console.log("fetchCurrentPatients::response",response.data)
          this.allPatients = response.data 
        }).catch((error) => {
          //this.notifyError()
          console.log("fetchCurrentPatients::Error",error)
        })
      }, 
      
      fetchPendingRequests(){
        const url = `/doctors/${this.doctorId}/requests`
        api.get(url) //doctors/{id}/requests
        .then((response) => {
          console.log("fetchPendingRequests::response",url , response.data)
          this.visitRequests = response.data 
        }).catch((error) => {
          //this.notifyError()
          console.log("fetchPendingRequests::Error",error)
        })
      }
    }
  })
  </script>
  <style scoped lang="sass">
  
  </style>
  