<template>
    <q-page padding><!--class="flex flex-center"-->
      
      <!---also get notifications for active requests for visitation & reply to each(with being able to )-->
     
      <!--should see current patients use tab prollly-->
      <q-tabs
      v-model="tab"
      dense
      active-color="primary"
      indicator-color="purple"
      align="justify"
      >
        <q-tab name="Patients" label="All Patients" />
        <q-tab name="RList" label="Requests">
          <q-badge v-if="visitRequests.length > 0" color="red" floating rounded>{{visitRequests.length}}</q-badge>
        </q-tab>
        <!-- tab to edit own info?-->
        <!--v-if? toTry**-->
        <q-tab name="Admin" label="Admin Stuff" :disable="!currentReq"/>
      </q-tabs>
      
      <q-tab-panels v-model="tab" animated>
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
        </q-tab-panel>
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
            <transition-group name="dalist">
              <q-expansion-item v-for="req in visitRequests" 
              class="q-my-sm"
              v-model="expanded[req.patientId]"
              :key="req.patientId"
              :label="req.action"
              :caption="req.reason"
              popup
              expandSeparator
              clickable>
              <!--should get more info on Patient todo**-->
              <template v-slot:default>
                <q-card><!--or use q-card actions more explicit?-->
                  <q-slide-item 
                  @right="(e) => onReqAction(e, 'Del', req)" 
                  @left="(e) => onReqAction(e, 'Edit', req)">
                    <template v-slot:left>
                      Edit
                    </template>
                    <template v-slot:right>
                      Delete
                    </template>
                    <q-item-section>
                      <q-item-label overline class="q-mx-lg q-px-md row justify-center no-wrap" style="max-width:100%;font-weight: bolder;">
                      {{ req.reason }} {{ req.action }} {{ new Date(req.on) }}
                      </q-item-label><!--getDay() & getHours()-->
                    </q-item-section>
                  </q-slide-item>
                </q-card>
              </template>
                
              </q-expansion-item>
            </transition-group>

          </q-list>
        </q-tab-panel>

        <q-tab-panel name="Admin">

        </q-tab-panel>
      </q-tab-panels>
      
    </q-page>
  </template>
  
  <script>
  import { defineComponent, ref, watchEffect,watch } from 'vue'
  import { useQuasar } from 'quasar'
  import { api } from 'boot/axios'
  import { dacOdacStore } from '../stores/dacOdac' 
  //import { useDacStore } from '../stores/dac-store' 
  
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
      const apiToken = ref(null)

      //watchEffect(() => {
        //console.log("watchEffect::apiToken",this.apiToken)
        //if(this.apiToken) {this.fetchAllPatients(this.apiToken)} //toSee if runs..
      //  this.fetchAllPatients(this.apiToken)
        //umm this.allPatients?
      //}),
      
      watch(apiToken,(apiTokn, prevApiToken) => {//or this.apiToken?
        console.log("watch::apiToken",apiTokn, prevApiToken)
        if(apiTokn){
          this.fetchAllPatients(apiTokn) //yeeeyuh
        }
      })
      
      return {
        //loggedAs:ref(null),
        allPatients:ref(null), //should be current patients 
        //allSpecialities:ref(null),
        visitRequests:ref([]),
        tab:ref('Patients'), //start by viewing current patients
        dacOStore: dacOdacStore(),
        apiToken:apiToken,//ref(null),
        currentReq:ref(null),
        expanded:ref({})
      }
    },
    
    beforeMount(){
      let token = this.dacOStore.getToken
      if(!token){
        this.getToken()
      }else {
        console.log("beforeMount::SKIP token request!", token);
        this.apiToken = token
      }  
      this.fetchPendingRequests();
    },
    /*mounted(){
      //let token = this.dacStore.savedToken()
      //let token = this.dacOStore.getToken
      //let t = this.dacOStore.getToken()
      console.log("mounted::",this.doctorId, this.apiToken)
      //this.apiToken = token

      //this.fetchAllPatients(); //test to get all patients
    },*/
    methods: {
      getToken() {
        const params = {
          "username": "admin", //toChange
          "password":"password"
        }
        
        const url = `/auth/login`
        //console.log("getToken::",url, params)

        //would below work? or manually set them?
        //api.defaults.headers.common['Authorization'] = AUTH_TOKEN;

        api.post(url,params)
        .then((response) => {
          console.log("getToken::response",response.data)
          //this.allDoctors = response.data 
          //this.dacStore.saveToken(response.data.token)
          this.dacOStore.saveToken(response.data.token)
          this.apiToken = response.data.token
        }).catch((error) => {
          //this.notifyError()
          console.log("getToken::Error",error)
        })
      },
      fetchAllPatients(token){ // //should be own patients --todo**
        if(!token){
          console.log("fetchAllPatients::no token",token)
          return
        }

        const url = `/patients` // `/doctors/${this.doctorId}/patients`
        api.get(url,{
          headers: {'Authorization': `Bearer ${token}`}, //this.apiToken
        })
        .then((response) => {
          console.log("fetchAllPatients::response",response.data)
          //console.log(response.status); //200
          //console.log(response.statusText); //OK
          //console.log(response.headers);
          //console.log(response.config);
          //console.log(response.request);

          this.allPatients = response.data 
        }).catch((error) => {
          //this.notifyError()
          // //error,
          console.log("fetchAllPatients::Error", error.status, error.message)
          if(error.status == '401'){
            //delete current token --todo**
            this.getToken(); //retry 
          }
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
          console.log("fetchPendingRequests::Error",error.status, error.message) //error
        })
      },
      onReqAction({reset},action, req){ //could be explicit with separate functions 'onRightDelete' & 'onLeftEdit' >>toReview**
        console.log("onReqAction::",action,req)
        reset() //umm
        switch (action) {
          case 'Del':
            console.log("onReqAction::Delete",req)
            //todo
            //api to add completion
            //remove from list 
            break
          case 'Edit':
            //todo api to get more info on patient?
            this.currentReq = req
            this.tab = "Admin"  //nav to Goal tab
        }
        
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
<style scoped lang="scss">
.dalist,
.dalist-enter-active,
.dalist-leave-active {
  transition: all 0.5s ease;
}
.dalist-enter-from,
.dalist-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly.-boof not that needed prolly--umm actually needed?*/
.dalist-leave-active {
    position: absolute;
}
</style>
  