<template>
  <div class="flex flex-center"> <h5> List of Doctors</h5></div>
    <div class="q-pa-md bg-grey-9 text-white">
      <q-list v-if="allDoctors && allDoctors.length > 0" class="rounded-borders" separator style="max-width: 600px"><!--bordered dark separator -->
        <q-item-label header>Select doctor for visit </q-item-label>

        <q-item v-for="doctor in allDoctors"
          :key="doctor.Id"
          clickable v-ripple
          to="/" @click="(evt, go)=>{console.log('heey')}"
          class="q-my-sm"><!--goToDoctor(evt, go, doctor)-->
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
                <span class="cursor-pointer">Delete</span>
              </q-item-label><!--{{requestLabel(doctor)}}-->
            </q-item-section>

            <q-separator spaced />
        </q-item>
      </q-list>
    </div>
</template>
<script>
import { ref,defineComponent } from 'vue'
import { fetchAllPatients,searchPatientByName, getPatientsCount,fetchDoctors} from '../pages/util/apiHelper'

//import * as e from '../pages/util/apiHelper' //toUse as easier//

//import { useQuasar } from 'quasar'
//import { api } from 'boot/axios'
//import { dacOdacStore } from '../stores/dacOdac' 


export default { //defineAsyncComponent
  name: 'ViewInfo',
  //components:{
    //actionRequest: defineAsyncComponent(() => import('../components/RequestDialog.vue')), //loadOnDemand
  //},
  props:{
    //title: String,
    //rows:Array,
    //columns:Array,
    //allPatients: Array,
    //entity:String, //entity viewed in above table--could be used for API endpoint hits...toReview**
    //token:String 
  },
  data(){
    
    return {
      allDoctors:ref(null),
      //
    }
  },
  beforeMount(){
    console.log('huh beforeMount')
    this.fetchAllDoctors()    
  },
  mounted(){
    // get initial data from server (1st page)
    console.log('huh mounted');
    //this.$refs.tableRef.requestServerInteraction()
  },
  computed:{
    //pagesNumber(){
    //  return Math.ceil(this.rows.length / this.initialPagination.rowsPerPage)
    //}
  },
  methods:{
    fetchAllDoctors(){
      fetchDoctors().then((response) => {
        console.log("fetchAllDoctors",response)
        this.allDoctors = response
      }) //todo** catch any errors....
    },
       
    doApiHit(fetchCount, startRow){
      fetchAllPatients(this.token,fetchCount, startRow)
      .then((response) => {
        console.log("doApiHit::fetchAllPatients::response", fetchCount, startRow,response.data)
        const returnedData = response.data
        this.rows.splice(0, this.rows.length, ...returnedData)// clear out existing data and add new
        this.loading = false   
      }).catch((error) => {
        //this.notifyError()
        console.log("doApiHit::fetchAllPatients::Error::",error)
      })
    }
  }
}
</script>