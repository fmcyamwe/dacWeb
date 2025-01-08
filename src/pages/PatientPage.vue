<template>
    <q-page><!--class="flex flex-center"-->
      <q-splitter
      v-model="splitterModel"
      style="height: 100%">

        <template v-slot:before>
          <q-tabs
            v-model="tab"
            vertical
            class="text-teal"
          >
            <q-tab name="info" icon="info" label="Info" />
            <q-tab name="doctors" icon="healing" label="Doctors" />
            <q-tab name="history" icon="medication" label="History" />
          </q-tabs>
        </template>
        <template v-slot:after>
          <q-tab-panels
          v-model="tab"
          animated
          swipeable
          vertical
          transition-prev="jump-up"
          transition-next="jump-up">
            <q-tab-panel name="info">
              <div class="text-h4 q-mb-md">Information</div>
              <p> Your current information...Edit/Update</p>
              <q-card class="no-margin scroll">
                <q-form @submit="onSubmit" class="form">
                  <q-input class="q-mx-none"
                  filled
                  v-model="firstName"
                  label="First Name"
                  clearable
                  lazy-rules
                  item-aligned
                  :rules="[ val => val && val.length > 1 || 'Please enter your first name']"
                  />
                  <q-input class="q-mx-none"
                  filled
                  v-model="lastName"
                  label="Last Name"
                  clearable
                  lazy-rules
                  item-aligned
                  :rules="[ val => val && val.length > 1 || 'Please enter your last name']"
                  />
                  <!--or use <q-option-group for other gender options?  class="typey"-->
                  <div class="q-gutter-sm q-mx-auto">
                    <strong><em>Gender:</em></strong>
                    <q-radio 
                    v-model="gender"
                    class="q-pa-md" 
                    checked-icon="task_alt" 
                    unchecked-icon="panorama_fish_eye" 
                    val="man" label="Man"/>

                    <q-radio 
                    v-model="gender"
                    checked-icon="task_alt" 
                    unchecked-icon="panorama_fish_eye" 
                    val="woman" 
                    label="Woman" />

                  </div>
                          
                  <q-input 
                  v-model="bornIn" 
                  filled 
                  type="number"
                  label="DOB"
                  stack-label
                  hint="Date of birth"
                  />
                  <!--stackLabel when using label 
                    type="date" "yyyy-MM-dd"  but prolly better to use type="number"?
                  -->
                  <!--current doctor & can change? todo**-->
                  <q-separator dark />
                  <div class="q-ml-sm q-mb-md q-gutter-md">
                    <q-btn label="Save" type="submit" color="primary"  align="between" @submit="onSubmit"/>
                  </div>
                </q-form>
              </q-card>
            </q-tab-panel>

            <q-tab-panel name="doctors">
              <div class="text-h4 q-mb-md">Doctors eh</div>
              <div class="flex flex-center"> <h5> List of Doctors</h5></div>
              <div class="q-pa-md bg-grey-9 text-white">
                <q-list v-if="allDoctors && allDoctors.length > 0" class="rounded-borders" separator style="max-width: 600px"><!--bordered dark separator -->
                  <q-item-label header>Select doctor for visit </q-item-label>

                  <q-item v-for="doctor in allDoctors"
                  :key="doctor.Id" 
                  clickable v-ripple
                  to="/" @click="(evt, go)=>goToDoctor(evt, go, doctor)"
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
            </q-tab-panel>

            <q-tab-panel name="history">
            <div class="text-h4 q-mb-md">Medical History</div>
            <p>Medical History including visits and treatments.</p>
            
          </q-tab-panel>

          </q-tab-panels>
        </template>
      
      </q-splitter>
    </q-page>
  </template>
  
  <script>
  import { defineComponent, ref, watch} from 'vue'
  import { useQuasar } from 'quasar'
  import { api } from 'boot/axios'
  import { dacOdacStore } from '../stores/dacOdac' 
  import actionRequest from '../components/RequestDialog.vue' 

  export default defineComponent({
    name: 'PatientPage',
    components:{
      //actionRequest: defineAsyncComponent(() => import('../components/RequestDialog.vue')), //loadOnDemand
    },
    props:{
      loggedAs: String,//needed? toRemove**
      patientId: {
        type: String,
        //required: true, //should be passed from login...toEnable**
        //default: '544e30f81841'  //for testing...
      }  
    },
    data () {
      const $q = useQuasar()
      const medicHist=ref(null)
  

      

      return {
        //loggedAs:ref(null),
        allDoctors:ref(null),
        tab: ref('info'), //doctors & history--todo** start with history?
        splitterModel: ref(20),
        dacOStore: dacOdacStore(),
        apiToken:ref(null),

        //patient info
        firstName:ref(''),
        lastName: ref(''),
        gender: ref('man'),
        bornIn: ref(0),

        attendingDoctors: ref(null),
        medicHist:medicHist,

      }
    },
    beforeMount(){
      let token = this.dacOStore.getToken
      if(!token){
        this.getToken()
      } else{
        console.log("beforeMount::SKIP token request!");
        this.apiToken = token
      }
      this.fetchDoctors();
    },
    mounted(){
      
      console.log("mounted::", this.patientId, this.apiToken) 
      //this.apiToken = token

      //should be done in beforeMount? --todo**
      this.getPatientInfo() 
    },
    
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
          //console.log("getToken::response",response.data)
          //this.dacStore.saveToken(response.data.token)
          this.dacOStore.saveToken(response.data.token)
          this.apiToken = response.data.token
          //console.log(response.status);
          //console.log(response.statusText);
          console.log(response.headers);
          console.log(response.config);
        }).catch((error) => {
          //this.notifyError()
          console.log("getToken::Error",error)
        })
      },
      fetchDoctors(){
        api.get('/doctors')  //patients should see doctors //patients  
        .then((response) => {
          console.log("response::",response.data)
          this.allDoctors = response.data 
        }).catch(() => {
          //this.notifyError()
          console.log("Error::",response.data)
        })
      },
      requestVisit(doc, opts){ //id
        const params = {
          "doctorId": doc.Id, //id,
          //"date": "2024-12-28T10:00:00",
          "reason": opts.reason, //"Routine check-up",
          "action":opts.choice //"visit"
        }
        
        const url = `/patients/${this.patientId}/requests`
        console.log("requestVisit::",url, params)

        api.post(url,params)
        .then((response) => {
          console.log("requestVisit::response",response.data)
            this.$q.notify({
            color: 'positive',
            position: 'bottom',
            message: `Request is ${response.data}`, //todo** show properly
            icon: 'thumbs_up'
          })
        }).catch((error) => {
          //this.notifyError()
          console.log("requestVisit::Error",error)
        })

      },
      goToDoctor(e, go, doc) { //id
        e.preventDefault() // mandatory; we choose when we navigate

        let doAction = (opt) => {//onOk
          //{choice:'reset', reason:''}
          this.requestVisit(doc,opt) //id
        }

        let doCancel = () => { //do cancel
          console.log('goToDoctor..Aborting')
          //this.reset() //todo***
          return
        }

        let isAttendingDoc = this.attendingDoctors.find(item => item.doctorId == doc.Id)

        console.log("goToDoctor::CurrentAttendingDoc::",doc, isAttendingDoc) //doc.Ithis.attendingDoctors

        //todo** validate doc.id
        let labels = [
          {label: `A visit`,value: 'visit'}, //disable: false  (to disable some options --toReview**)
          {label: `Request Treatment`,value: 'treatment', disable: !isAttendingDoc },
          {label: `Simple Checkup`,value: 'checkup'}, //redundant but can be modified..can be used to have patient become doc's ? 
        ]

        let title = 'Action Request'
        let message = 'Choose request for: '+doc.firstName + ' '+doc.lastName

        this.scheduleByDialog(title,message,labels,!isAttendingDoc,doAction,doCancel)
        //could add auto 'doAction' in some cases? toReview**

        //this.requestVisit(id)

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
      },
      fetchMedical(){      
        const url = `/patients/${this.patientId}/more`

        api.get(url,{//need auth!!
          headers: {'Authorization': `Bearer ${this.apiToken}`},
        }).then((response) => {
          this.medicHist = response.data;
          //return response.data;
        })

      },
      getPatientInfo(){
        const url = `/patients/${this.patientId}`

        api.get(url,{//need auth!!
          headers: {'Authorization': `Bearer ${this.apiToken}`},
        })
        .then((response) => {
          console.log("getPatientInfo::response",response.data)
          let data = response.data
          this.firstName = data.firstName
          this.lastName = data.lastName
          this.gender = data.gender
          this.bornIn = data.born  //todo** rename

          //this.fetchMedical();
        }).catch((error) => {
          //this.notifyError()
          // //error,
          console.log("getPatientInfo::Error", error.status, error.message)
          if(error.status == '401'){
            //delete current token --todo**
            this.getToken(); //retry 
            
          }
        })

        //should have attending doctor in above return but for now separate query--toChange
        api.get(`/patients/${this.patientId}/doctors`,{
          headers: {'Authorization': `Bearer ${this.apiToken}`},//need auth!!
        })
        .then((response) => {
          console.log("getPatientAttendingDoctors::response",response.data)
          this.attendingDoctors = response.data
        }).catch((error) => {
          //this.notifyError()
          // //error,
          console.log("getPatientAttendingDoctors::Error", error.status, error.message)
          //if(error.status == '401'){
            //delete current token --todo**
          //  this.getToken(); //retry 
          //}
        })

      },
      onSubmit(){
        console.log(`onSubmit :: for ${this.patientId}`,this.firstName,this.lastName,this.gender,this.bornIn)
        
        const url = `/patients/${this.patientId}`

        const params = {
          "id": this.patientId,
          "firstName": this.firstName,
          "lastName": this.lastName,
          "born": this.bornIn,
          "gender": this.gender
        }

        console.log("onSubmit::",url, params)
        api.put(url,params)//{
          //headers: {'Authorization': `Bearer ${this.apiToken}`},
          //params:params
        //}) //broks when headers are added smh
        .then((response) => {
          console.log("onSubmit::response",response.data)
          
        }).catch((error) => {
          //this.notifyError()
          console.log("onSubmit::Error",error)
        })
      },
      notifyError(){
        this.$q.notify({ //weirdly complains on $q access?
          color: 'negative',
          position: 'top',
          message: 'API connection failed',
          icon: 'report_problem'
        })
      },
      scheduleByDialog(title, mess,labels,isNotAttendingDoc, onOk = null,onCancel = null,onDismiss=null){
        this.$q.dialog({
          component: actionRequest,
          componentProps: {
            title:title,
            message:mess,
            options:labels,
            showDisabled:isNotAttendingDoc
          }
        }).onOk((data) => {
          if (onOk) {
            if(data.choice == ''){ //invoked again to handle when user doesnt make selection!
              this.scheduleByDialog(title,mess, labels,selectedM, onOk,onCancel,onDismiss)
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
      }
    }
  })
  </script>
  <style scoped lang="sass">
  
  </style>
  