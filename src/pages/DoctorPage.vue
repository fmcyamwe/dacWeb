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
                   Click to add treatment for Patient
                 </q-item-label><!--umm weird...should show patientPage...-->
              </q-item-section>
              <q-separator spaced />
            </q-item><!--v-morph:tree:mygroup:500.tween="morphGroupModel" -->

            <q-item v-for="patient in allPatients"
            :key="patient.Id"
            clickable v-ripple
            class="q-my-sm" @click="(evt, go) => clickedPatient(evt, go, patient)" >
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
              <!--<template v-slot:header>
                <div class="col"> 
                  {{ req.action }} requested on {{ new Date(req.on).toDateString() }}
                </div>
              </template> -->
              <template v-slot:default>
                <q-card><!--or use q-card actions more explicit? and get more info on Patient?(i.e if own patient?)-->
                  <q-slide-item
                  @left="(e) => onReqAction(e, 'Accept', req)"
                  @right="(e) => onReqAction(e, 'Deny', req)">
                    <template v-slot:left>
                      Accept
                    </template>
                    <template v-slot:right>
                      Deny
                    </template>
                    <q-item-section> <!--seems better than using v-slot:header above-->
                      <div class="col"> 
                        {{ req.action }} on {{ new Date(req.on).toDateString() }}
                      </div>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label overline class="q-mx-lg q-px-md row justify-center no-wrap" style="max-width:100%;font-weight: bolder;">
                      By {{ req.patientName }} {{ req.reason }} 
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
          <!--testing for paginationTable >>should move revert and use table someplace else >>:rows="allPatients" -->
          <pagination-table
          title="Patients"
          :columns="cols"
          :token="apiToken"
          />
        </q-tab-panel>
        
      </q-tab-panels>
      
    </q-page>
  </template>
  
  <script>
  import { defineComponent, ref,watch } from 'vue'
  import { useQuasar } from 'quasar'
  import { api } from 'boot/axios'
  import { dacOdacStore } from '../stores/dacOdac'
  import { getDocInfo,anotherGetDocInfo,fetchOwnPatients,fetchDocPendingRequests,fetchAllPatients } from '../pages/util/apiHelper'
  import treatmentRequest from '../components/Treatment.vue'
  import paginationTable from '../components/paginationTable.vue'

  export default defineComponent({
    name: 'DoctorPage',
    components:{
      paginationTable
    },
    props:{
      loggedAs: String,
      doctorId: {
        type: String,
        //required: true, //should be passed from login...toEnable**
        //default: 'obiii'  // c8656a6a17ba (multiple requests from same) //for testing...
      } 
    },
    data () {
      const $q = useQuasar()
      const apiToken = ref(null)

      watch(apiToken,(apiTokn, prevApiToken) => {
        //console.log("watch::apiToken",apiTokn, prevApiToken)
        if(apiTokn){
          this.fetchPatients(apiTokn)
        }
      })
      
      return {
        //loggedAs:ref(null),
        allPatients:ref(null),
        currentPatients:ref([]), //own patients 
        visitRequests:ref([]), //todo** rename to patientRequests || actionRequests....
        tab:ref('Patients'), //start by viewing current patients
        dacOStore: dacOdacStore(),
        apiToken:apiToken,//ref(null),
        currentReq:ref(null),
        expanded:ref({}),
        morphGroupModel: ref('item'), //redundant--toRemove
        nextMorphStep: ref({ //same as above--toRemove
          item: 'card1',
          card1: 'card2',
          card2: 'item'
        }),

        //doctor's info
        allSpecialities:ref(null),
        firstName:ref(''),
        lastName:ref(''),
        speciality:ref(''),
        practiseSince:ref(null),
        cols:[
          { name: 'Id', align: 'center', label: 'ID', format: (val) => `${val}%`, field: 'Id'},
          { name: 'firstName', align: 'center', label: 'First Name', field: 'firstName'},
          { name: 'lastName', align: 'center', label: 'Last Name', field: 'lastName'}
        ]
        //format: val => `${val}`,
        //could use field:... to show Specialities?!? toSee
        
      }
    },
    beforeMount(){
      let token = this.dacOStore.getToken
      if(!token){
        this.getToken()
      }else {
        //console.log("beforeMount::SKIP token request!", token);
        this.apiToken = token
      }  
      this.fetchPendingRequests();
    },
    mounted(){
      //let token = this.dacStore.savedToken()
      //let token = this.dacOStore.getToken
      //let t = this.dacOStore.getToken()
      console.log("mounted::",this.doctorId)//, this.apiToken)
      //own info--toReview** if needed or should do api hit when in 'Admin' tab
      this.getCurrentyDocInfo() //getCurrentDocInfo()
      this.fetchAllSpecities()
    },
    computed:{
      specialityLabel(){
        if(!this.speciality) return "Select";

        return this.speciality
      },
    },
    methods: {
      onSelect(e){
        console.log("onSelect::speciality",e)
        this.speciality = e
      },
      fetchAllSpecities(){
        api.get('/specialities')
        .then((response) => {
          //console.log("fetchAllSpecialities::response::",response.data)
          this.allSpecialities = response.data 
        }).catch((error) => {
          //this.notifyError()
          console.log("fetchAllSpecities::Error::",error)
        })
      },
      getToken() {
        const params = {
          "username": "admin", //toChange
          "password":"password"
        }
        
        const url = `/auth/login`
        console.log("getToken::",url, params,this.doctorId)

        //would below work? or manually set them?
        //api.defaults.headers.common['Authorization'] = AUTH_TOKEN;

        api.post(url,params)
        .then((response) => {
          console.log("DoctorPage::getToken>>response",response.data)
          //this.allDoctors = response.data 
          //this.dacStore.saveToken(response.data.token)
          this.dacOStore.saveToken(response.data.token) //should overwrite current token
          this.apiToken = response.data.token
        }).catch((error) => {
          this.notifyError("Error fetching Auth token: "+error.status)
          this.dacOStore.deleteToken(); //just delete any stored token
          console.log("getToken::Error",error)
        })
      },
      getOwnPatients(){
        fetchOwnPatients(this.doctorId,this.apiToken)
        .then((response) => {
          console.log("getOwnPatients::response",response.data)
          //this.allPatients = response.data //toChange where this goes...
        })
        .catch((error) => {
          console.log("getOwnPatients::Error", error.status, error.message)
          if(error.status == '401'){
            this.getToken(); //refresh token and retry ...todo** pass callback
          }
        })
      },
      fetchPatients(token){ //testing pagination as above function is more applicable
        if(!token){
          console.log("fetchPatients::no token",token)
          return
        }
        // `/doctors/${this.doctorId}/patients`
        //const url = '/patients?PageSize=10&PageIndex=0'
        //api.get(url,{
        //  headers: {'Authorization': `Bearer ${token}`}, //this.apiToken
        //})
        fetchAllPatients(token,10,0) //this.doctorId,
        .then((response) => {
          console.log("fetchPatients::response",response.data)
          //console.log(response.status); //200
          //console.log(response.statusText); //OK
          //console.log(response.headers);
          //console.log(response.config);
          //console.log(response.request);

          this.allPatients = response.data 
        }).catch((error) => {
          //this.notifyError()
          // //error,
          console.log("fetchPatients::Error", error.status, error.message)
          if(error.status == '401'){
            this.getToken(); //refresh token and retry --todo**
          }
        })
      },
      fetchPendingRequests(){
        //const url = `/doctors/${this.doctorId}/requests`
        //api.get(url) //doctors/{id}/requests
        fetchDocPendingRequests(this.doctorId,this.apiToken)
        .then((response) => {
          console.log("fetchPendingRequests::response", response.data)
          this.visitRequests = response.data 
        }).catch((error) => {
          //this.notifyError()
          console.log("fetchPendingRequests::Error",error.status, error.message) //error
        })
      },
      onReqAction({reset},action, req){ //could be explicit with separate functions for 'onRight' & 'onLeft' actions but small enough
        console.log("onReqAction::",action,req)
        reset() //umm

        const url = `/doctors/${this.doctorId}/requests`

        let doAction = (params) => {
          api.post(url,params)
            .then((response) => {
              console.log("onReqAction::doAction >>response",url , response.data)
              //this.visitRequests = response.data 
              for( var i = 0; i < this.visitRequests.length; i++){
                if ( this.visitRequests[i].id == req.patientId) {
                  this.visitRequests = this.visitRequests.splice(i, 1);  //remove from list --toTest** update properly!
                }                
              }
            }).catch((error) => {
              this.notifyError("Error on Request Action:: "+action, error.message)
              console.log("onReqAction::doAction >>error",error.status, error.message) //error
            })
          }

        switch (action) {
          case 'Deny':
            console.log("onReqAction::Denied",req)
            const params = {
              "patientId": req.patientId,
              "action":req.action,
              "status": "denied"
            }
            doAction(params)
           
            break
          case 'Accept':
            //todo api to get more info on patient?
            this.currentReq = req
            //this.tab = "Admin"  //nav to Goal tab...prolly not
            //when it's treatment  >>todo** >>
            /*this.addTreatmentDialog(
              "Add Treatment",
              function(opt){ //onOk---
                doAction(opt) //labely.length < 2
              },
              function(opt){ //onCancel---
                console.log("Adding treatment...cancelling "+p.firstName)
              },
              null //onDismiss
            )*/

            const paramz = {
              "patientId": req.patientId,
              "action":req.action,
              "status": "accepted"
            }
            doAction(paramz)
        }
        
      },
      addTreatment(patient, opts){
        if(!opts || opts.name.trim() == ''){ //check patient too?
          this.notifyError("A Treatment need a valid name! Try again.")
          return
        }

        const params = {
          "patientId": patient.Id,
          "doctorId":this.doctorId,
          "name": opts.name, //"Routine check-up",
          "details":opts.details //"visit"
        }
        
        const url = `/patients/${patient.Id}/treatments` //patients/{id}/treatments
        console.log("addTreatment::",url, params)

        api.post(url,params)
        .then((response) => {
          console.log("addTreatment::response",response.data)
          this.positiveNotify(`Request is ${response.data}`) //todo** show properly
          /*this.$q.notify({
            color: 'positive',
            position: 'top',
            message: `Request is ${response.data}`,
            icon: 'thumb_up'
          })*/
        }).catch((error) => {
          //this.notifyError()
          console.log("addTreatment::Error",error)
        })
      },
      clickedPatient(evt,go,p){ 
        //should check if own patient
        ///if >treatment dialog
        ///ifNot then dialog below to make mine?
        evt.preventDefault()
        console.log("clickedPatient",p)

        let doAction = (opt) => {//onOk
          //{choice:'reset', reason:''}
          this.addTreatment(p,opt) //id
        }

        this.addTreatmentDialog(
          "Add Treatment",
          function(opt){ //onOk---
            doAction(opt)
          },
          function(){ //onCancel---
            console.log("Adding treatment...cancelling for patient:: "+p.firstName)
          },
          null //onDismiss
        )

        /*
        this.$q.dialog({
          title: "title",
          cancel: 'Mine', //true,
          ok: "Add", //okbtn, //
          //persistent:true,
          noBackdropDismiss:true, //esc execute onCancel--toReview**
          //persistent:      
          // position:
        }).onDismiss(() => {
          //if(executeDismiss){
          //  executeDismiss()
          //  return
          //}
        })
        */
      },
      addTreatmentDialog(title, onOk = null,onCancel = null,onDismiss=null){ //mess,labels,selectedM,
        this.$q.dialog({
          component: treatmentRequest,
          componentProps: {
            title:title,
            message:"wee"
            //options:labels,
            //selectedO:selectedM
          }
        }).onOk((data) => {
          if (onOk) {
            if(data.choice == ''){ //invoked again to handle when user doesnt make selection!
              this.addTreatmentDialog(title, onOk,onCancel,onDismiss)
            }else {
              //console.log('scheduleByDialog::onOk!!',data)
              onOk(data)
            }
          }
        }).onCancel(() => {
            if (onCancel) {
              onCancel()
            }
        }).onDismiss(() => {
            if(onDismiss){ //for cleanup and other actions
              //console.log('scheduleByDialog::onDismiss!! executin...')
              onDismiss()
          }
        })
      },
      onSubmit(){
        console.log(`onSubmit Doctor::`,this.firstName,this.lastName,this.speciality,this.practiseSince)
            
        //const url = `/doctors/new/` //not new doctor >>works at least lool 
        const url = `/doctors/${this.doctorId}`
        const params = {
          "firstName": this.firstName,
          "lastName": this.lastName,
          "speciality": this.speciality,
          "practiseSince": this.practiseSince
        }

        console.log("onSubmit::",url, params)
        api.put(url,params)
        //api.post(url,params)//{
          //headers: {'Authorization': `Bearer ${this.apiToken}`},
          //params:params}
        .then((response) => {
          console.log("onSubmit::response",response.data)
          //this.reset();
        }).catch((error) => {
          //this.notifyError()
          console.log("onSubmit::Error",error)
        })
      },
      getCurrentyDocInfo(){
        anotherGetDocInfo(this.doctorId,this.apiToken).then((response) => {
          //console.log("getCurrentyDocInfo::response",response)
          //let data = response.data
          this.firstName = response.firstName
          this.lastName = response.lastName
          this.speciality = response.speciality
          this.practiseSince = response.practiseSince
          
          this.currentReq = this.doctorId //enable Admin--toReview**
        }).catch((error) => {
          console.log("getCurrentyDocInfo::Error", error.status, error.message)
        })
      },
      getCurrentDocInfo(){
        
        //const url = `/doctors/${this.doctorId}`

        //api.get(url,{//need auth!!
        //  headers: {'Authorization': `Bearer ${this.apiToken}`},
        //})
        getDocInfo(this.doctorId,this.apiToken)
        .then((response) => {
          console.log("getCurrentDocInfo::response",response.data)
          let data = response.data
          this.firstName = data.firstName
          this.lastName = data.lastName
          this.speciality = data.speciality
          this.practiseSince = data.practiseSince
          
          this.currentReq = this.doctorId //enable Admin--toReview**
        }).catch((error) => {
          this.notifyError("getCurrentDocInfo::Error "+ error.status)
          // //error,
          console.log("getCurrentDocInfo::Error", error.status, error.message)
          //if(error.status == '401'){
            //--todo** handle error
          //  this.getToken(); //retry 
            
          //}
        })
      },
      positiveNotify(message){
        this.$q.notify({
          color: 'positive',
          position: 'top',
          message: message,
          icon: 'thumb_up'
        })
      },
      notifyError(message){
        this.$q.notify({
          color: 'negative',
          position: 'top',
          message: message, //'API connection failed',
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
  