<template>
  
    <q-page >
      
      <!--class="flex flex-center"
        <img
        alt="Dac logo"
        src="~assets/dac-O-dac-logo.svg"
        style="width: 200px; height: 200px"
      >
      :limits="[50, 50]"
        -->
      <div>
        <q-splitter
        v-model="splitterPage"
        style="height: 400px"
        >

            <template v-slot:before>
                <div class="q-pa-md">
                <div class="text-h4 q-mb-md">Add New Patient</div>
                <q-card class="no-margin scroll">
                    <q-form @submit="onSubmit" class="form">
                    <q-input class="q-mx-none"
                    filled
                    v-model="firstName"
                    label="First Name"
                    clearable
                    lazy-rules
                    item-aligned
                    :rules="[ val => val && val.length > 1 || 'Please enter the first name']"
                    />
                    <q-input class="q-mx-none"
                    filled
                    v-model="lastName"
                    label="Last Name"
                    clearable
                    lazy-rules
                    item-aligned
                    :rules="[ val => val && val.length > 1 || 'Please enter the last name']"
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
                    
                    <q-separator dark />
                    <div class="q-ml-sm q-mb-md q-gutter-md">
                        <q-btn label="Save" type="submit" color="primary"  align="between" @submit="onSubmit"/>
                    </div>
                    </q-form>
                </q-card>
                
             </div>
            </template>

            <template v-slot:after>
                <div class="q-pa-md">
                <div class="text-h4 q-mb-md">Add New Doctor</div>
                <q-card class="no-margin scroll">
                    <q-form @submit="onNewDoc" class="form">
                    <q-input class="q-mx-none"
                    filled
                    v-model="firstName"
                    label="First Name"
                    clearable
                    lazy-rules
                    item-aligned
                    :rules="[ val => val && val.length > 1 || 'Please enter a first name']"
                    />
                    <q-input class="q-mx-none"
                    filled
                    v-model="lastName"
                    label="Last Name"
                    clearable
                    lazy-rules
                    item-aligned
                    :rules="[ val => val && val.length > 1 || 'Please enter a last name']"
                    />
                    <!--or use <q-option-group for other gender options?  class="typey"-->
                    <div class="q-gutter-sm q-mx-auto">
                        <strong><em>Speciality:</em></strong>
                        <q-btn-dropdown
                        color=""
                        text-color="teal"
                        elevated
                        no-caps
                        :label="specialityLabel"
                        ><!--@click="onClicked"-->
                            <q-list>
                                <q-item v-for="(item, index) in allSpecialities" 
                                :key="index" 
                                clickable
                                @click="onSelect(item)" v-close-popup>
                                    <q-item-section>
                                        <q-item-label>{{item }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-btn-dropdown>

                    </div>
                    <q-input class="q-mx-none"
                    filled
                    v-model="practiseSince"
                    type="date"
                    label="Practising since"
                    clearable
                    stackLabel
                    item-aligned
                    />     
                    <!--stackLabel when using label 
                        type="date" "yyyy-MM-dd"  but prolly better to use type="number"?
                    -->
                    
                    <q-separator dark />
                    <div class="q-ml-sm q-mb-md q-gutter-md">
                        <q-btn label="Save" type="submit" color="primary"  align="between" @submit="onNewDoc"/>
                    </div>
                    </q-form>
                </q-card>
                </div>
            </template>

        </q-splitter>
    </div>
      
    </q-page>
  </template>
  
  <script>
  import { defineComponent,defineAsyncComponent, ref } from 'vue'
  import { useQuasar } from 'quasar'
  import { api } from 'boot/axios'

  export default defineComponent({
    name: 'AdminPage',
    components:{
      //CustomToolBar: defineAsyncComponent(() => import('../components/customToolBar.vue')), //loadOnDemand
    },
    props:{
      someProp: String  //default: ''
    },
    data () {
      const $q = useQuasar()
      
      return {
        splitterPage:ref(35), // start--left side--before at 35%
        loggedAs:ref(null),
        allSpecialities:ref(null),
        firstName:ref(''),
        lastName:ref(''),
        gender:ref(null), //umm confirm can check
        bornIn:ref(0),
        speciality:ref(''),
        practiseSince:ref('')
      }
    },
    beforeMount(){
        this.fetchAllSpecities();
    },
    computed: {
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
                //console.log("fetchAllSpecities::response::",response.data)
                this.allSpecialities = response.data 
            }).catch((error) => {
                //this.notifyError()
                console.log("fetchAllSpecities::Error::",error)
            })
        },
        onSubmit(){
            console.log(`onSubmit Patient::`,this.firstName,this.lastName,this.gender,this.bornIn)
            
            const url = `/patients/`

            const params = {
                "firstName": this.firstName,
                "lastName": this.lastName,
                "born": this.bornIn,
                "gender": this.gender
            }

            console.log("onSubmit::",url, params)
            api.post(url,params)//{
            //headers: {'Authorization': `Bearer ${this.apiToken}`},
            //params:params}
            .then((response) => {
                console.log("onSubmit::response",response.data)
                this.reset();
            }).catch((error) => {
                //this.notifyError()
                console.log("onSubmit::Error",error)
            })
        },
        onNewDoc(){
            console.log(`onSubmit Doctor::`,this.firstName,this.lastName,this.speciality,this.practiseSince)
            
            const url = `/doctors/new/`

            const params = {
                "firstName": this.firstName,
                "lastName": this.lastName,
                "speciality": this.speciality,
                "practiseSince": this.practiseSince
            }

            console.log("onSubmit::",url, params)
            api.post(url,params)//{
            //headers: {'Authorization': `Bearer ${this.apiToken}`},
            //params:params}
            .then((response) => {
                console.log("onSubmit::response",response.data)
                this.reset();
            }).catch((error) => {
                //this.notifyError()
                console.log("onSubmit::Error",error)
            })
        },
        reset(){
            this.firstName = ''
            this.lastName = ''
            this.gender = null
            this.bornIn = 0
            this.speciality = ''
            this.practiseSince = ''
        }
    }
  
  })
  </script>
  <style scoped lang="sass">
  
  </style>
  