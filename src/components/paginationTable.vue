<template>
    <div class="q-pa-md">
      <q-table
        flat bordered
        ref="tableRef"
        :title="title"
        :rows="rows"
        :columns="columns"
        row-key="Id"
        v-model:pagination="initialPagination"
        :loading="loading"
        :filter="filter"
        binary-state-sort
        @request="onRequest"
        hide-pagination
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:loading><!--custom loading spinner..toSee**-->
          <q-inner-loading showing color="primary" />
        </template>
      </q-table>

      <div class="row justify-center q-mt-md"><!--with hide-pagination above methink? toSee**-->
      <q-pagination
        v-model="initialPagination.page"
        color="grey-8"
        :max="pagesNumber"
        size="sm"
      />
    </div>
    </div>
</template>
<script>
import { ref, onMounted,defineComponent } from 'vue'
import { fetchAllPatients,searchPatientByName, getPatientsCount } from '../pages/util/apiHelper'

//import { useQuasar } from 'quasar'
//import { api } from 'boot/axios'
//import { dacOdacStore } from '../stores/dacOdac' 
//import { getPatientsCount } from '../pages/util/apiHelper'


export default defineComponent({ //defineAsyncComponent
  name: 'paginationTable',
  //components:{
    //actionRequest: defineAsyncComponent(() => import('../components/RequestDialog.vue')), //loadOnDemand
  //},
  props:{
    title: String,
    //rows:Array,
    columns:Array,
    //allPatients: Array,
    //entity:String, //entity viewed in above table--could be used for API endpoint hits...toReview**
    token:String 
  },
  data(){
    
    return {
      initialPagination: ref({
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 3,
        rowsNumber: 3 //xx if getting data from a server >>10
      }),
      loading: ref(false),
      tableRef: ref(),
      filter: ref(''),
      rows:ref([]) //null //array better prolly
    }
  },
  /*beforeMount(){
    console.log('huh beforeMount');
    getPatientsCount().then((response) => {
      console.log("beforeMount::getPatientsCount",response)
      this.initialPagination.rowsNumber = response
    }) //todo** catch any errors....
  },*/
  mounted(){
    // get initial data from server (1st page)
    console.log('huh mounted');
    this.$refs.tableRef.requestServerInteraction()
  },
  computed:{
    pagesNumber(){
      return Math.ceil(this.rows.length / this.initialPagination.rowsPerPage)
    }
  },
  methods:{
    // emulate 'SELECT count(*) FROM ...WHERE...'
    // should be filtering via searchPatientByName() todo**
    getRowsNumberCount (filter) {
      if (!filter) {
        return originalRows.length
      }
      let count = 0
      originalRows.forEach(treat => {
        if (treat.name.includes(filter)) {
          ++count
        }
      })
      return count
    },
    onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter
      this.loading = true

      //return // >> to avoid mutating errors below... 
      // umm yeah would have to do first load via api request and then next pages,etc...

      //initialPagination.value.rowsNumber = getRowsNumberCount(filter)
      //  //todo** add filtering by name above 
      
      // on first load >>get the row count via api hit....
      getPatientsCount().then((response) => {
        console.log("onRequest::getPatientsCount",response)
        this.initialPagination.rowsNumber = response

         // get all rows if "All" (0) is selected
        const fetchCount = rowsPerPage === 0 ? this.initialPagination.rowsNumber : rowsPerPage
        
        // calculate starting row of data
        const startRow = (page - 1) * rowsPerPage
        //even when puts in beforeMount and mounted smh
        console.log("onRequest::getPatientsCount >>", fetchCount,startRow,rowsPerPage,this.initialPagination.rowsNumber)

        this.doApiHit(fetchCount,startRow) //toSee ** if should pass other...OR make it a promise! for updates below...

        this.initialPagination.page = page
        this.initialPagination.rowsPerPage = rowsPerPage
        this.initialPagination.sortBy = sortBy
        this.initialPagination.descending = descending
      }).catch((error) => {
        console.log("onRequest::getPatientsCount>>ERROR",error)
        this.loading = false
        //umm do something else prolly...toReview**
      })
      
      
      // get all rows if "All" (0) is selected
      //const fetchCount = rowsPerPage === 0 ? this.initialPagination.rowsNumber : rowsPerPage
      
      //even when puts in beforeMount and mounted smh
      console.log("onRequest::getHere too fast? yup :(", this.initialPagination.rowsNumber)
      
      // calculate starting row of data
      //const startRow = (page - 1) * rowsPerPage

      // fetch data from "server"
      //const returnedData = fetchFromServer(startRow, fetchCount, filter, sortBy, descending)
      /*fetchAllPatients(this.token,10,0)
      .then((response) => {
        console.log("onRequest::fetchAllPatients::response", fetchCount, startRow,response.data)
        const returnedData = response.data
        this.rows.splice(0, this.rows.length, ...returnedData)
      }).catch((error) => {
        //this.notifyError()
        console.log("onRequest::fetchAllPatients::Error::",error)
      })
  
       // update local pagination object --todo** move in the .then()
      this.initialPagination.page = page
      this.initialPagination.rowsPerPage = rowsPerPage
      this.initialPagination.sortBy = sortBy
      this.initialPagination.descending = descending

      // ...and turn of loading indicator
      this.loading = false */   
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
})
</script>