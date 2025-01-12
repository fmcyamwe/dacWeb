<template>
    <q-dialog ref="dialogRef" transition-show="rotate" transition-hide="rotate" @hide="onDialogHidey">
    <!--<q-dialog  v-model="showy" @before-hide="gonHide"> -->
      <q-card class="my-dialog">
          <div class="q-ma-md title"> {{title}} </div>
          
          <q-separator dark />

          <q-card-section class="q-gutter-md">
            <q-input
            v-model="aName"
            filled
            label="Name"
            lazy-rules
            item-aligned
            :rules="[(val) => (val && val.length > 1) || 'Treatment Name cannot be empty']"
            />
            <q-input
            filled
            v-model="Adetails"
            label="Description"
            class="col q-mx-sm q-pa-md"
            />
          </q-card-section>

          <q-separator dark />
          
          <q-card-section>
             <!--hidden when filter is selected --toReview**-->
            euuuh?
          </q-card-section>

          <q-card-actions align="center" class="q-mx-md"><!-- class="q-gutter-md q-mx-md inputBtn" icon="delete_forever" icon="check_circle"-->
            <q-btn
            label="Cancel"
            flat 
            color="primary"
            @click="onCancelyClick"
            />
            <q-separator :vertical="true"/>
            <q-btn
            label="Add"
            flat 
            color="primary"
            @click="onOKyClick"
            /> 
          </q-card-actions>
      </q-card>
    </q-dialog>
</template>
<script>
import { defineComponent,ref } from 'vue'
import { useDialogPluginComponent } from 'quasar' //needed?>> emits dont seem to work without it so far....
export default defineComponent ({  //this be Options Vue notation
    name: 'treatmentRequest', //todo** rename to treatmentDialog
    props: {
      title: String,
      message:String
      //options:Array,
      //selectedO:String,
      //showDialog: Boolean, //default hide/show. //huh redundant
    },
    emits: [
        'onCancel',
        'onOk',
        //'euhHidin', //redundant..
        'ok','hide' //needed
    ],
    data(){
        //const errorMessageScore = ref('')
        //const skipOvCheck = ref(false)
        return{
            //showey:this.showDialog, //ref(true), // dialog show/hide //true by default...redundant prolly cause of dialogRef
            //mess:this.message,
            //daOptions:this.options,
            reason: ref(''),  //todo** rename
            details: ref(''), //this.selectedO //ref('line'), //nothing selected
        }
    },
    setup(){
        const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
        return{
            dialogRef,
            onDialogHide,
            onDialogOK,
            onCancelClick: onDialogCancel,
        }
    },
    computed: {
        /*oCheck:{
          get(){return this.skipOvCheck},
          set(value){
            //console.log(`setting aNote from: ${this.notes} to ${value}`) 
            this.skipOvCheck = value
          }
        },*/
        aName:{
          get(){return this.reason},
          set(value){
            this.reason = value
          }
        },
        Adetails:{
          get(){return this.details},
          set(value){
            this.details = value
          }
        },
    },
    methods: {
        // following method is REQUIRED
        // (don't change its name --> "show")
        show () {
            this.$refs.dialogRef.show()
        },

        // following method is REQUIRED
        // (don't change its name --> "hide")
        hide () {
            this.$refs.dialogRef.hide()
        },
        onDialogHidey () {
            // required to be emitted
            // when QDialog emits "hide" event

            this.$emit('hide') //'euhHidin'
            this.onDialogHide()//invoke onDialogHide..no complains..not needed as for onDialogOK below ?!?
            //this.showy = false 
        },
        onOKyClick () {
            // on OK, it is REQUIRED to
            // emit "ok" event (with optional payload)
            // before hiding the QDialog
            //console.log('huh onOKyClick?',this.oChoice, this.oCheck)
           
            this.$emit('ok',{name:this.aName, details:this.Adetails})
            // or with payload: this.$emit('ok', { ... })

            // this.onDialogOK(this.oChoice, this.oCheck) //not needed? or for closing dialog?
            // then hiding dialog
            this.hide()
        },
        onCancelyClick () {
        // we just need to hide the dialog
            this.$emit('onCancel')
            
            this.hide()
        }

    }
})
</script>
<style lang="sass" scoped>
.inputBtn
  text-align: center

.title
  position: relative
  display: flex
  justify-content: center
  align-items: center

.message
  color: #2196F3
  position: relative
  display: flex
  justify-content: center
  align-items: center

.my-dialog
  width: 100%
  background-color: gainsboro

@media (max-width: 500px)
  .somethingToHide
    display: none

</style>