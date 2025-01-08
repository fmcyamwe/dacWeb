<template>
    <q-dialog ref="dialogRef" transition-show="rotate" transition-hide="rotate" @hide="onDialogHidey">
    <!--<q-dialog  v-model="showy" @before-hide="gonHide"> -->
      <q-card class="my-dialog">
          <div class="q-ma-md title"> {{title}} </div>
          <div class="q-ma-md message" > {{mess}} </div>

          <q-separator dark />

          <q-card-section class="q-gutter-md">
            <div>
                <q-option-group
                v-model="oChoice"
                :options="daOptions"
                /><!--inline-->
            </div>
          </q-card-section>
          
          <q-card-section>
             <!--hidden when filter is selected --toReview**-->
             <q-item-label v-if="showDisabled">
                <em>**Disabled option as not currentDoc</em>
             </q-item-label>
            <q-input v-if="oChoice != 'filter'"
            v-model="aReason"
            filled
            label="Reason"
            lazy-rules
            item-aligned
            :rules="[(val) => (val && val.length > 1) || 'Please type a reason']"
            />
          </q-card-section>

          <q-separator dark />
  
          <q-card-actions align="center" class="q-mx-md"><!-- class="q-gutter-md q-mx-md inputBtn" icon="delete_forever" icon="check_circle"-->
            <q-btn
            label="Cancel"
            flat 
            color="primary"
            @click="onCancelyClick"
            />
            <q-separator :vertical="true"/>
            <q-btn
            label="Ok"
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
    name: 'actionRequest',
    props: {
      title: String,
      message:String,
      options:Array,
      showDisabled:Boolean
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
            mess:this.message,
            daOptions:this.options,
            reason: ref(''),
            optGroup: this.selectedO //ref('line'), //nothing selected
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
        aReason:{
          get(){return this.reason},
          set(value){
            //console.log(`setting aNote from: ${this.notes} to ${value}`) 
            this.reason = value
          }
        },
        oChoice:{
          get(){return this.optGroup},
          set(value){
            //console.log(`setting oChoice from: ${this.optGroup} to ${value}`) 
            this.optGroup = value
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
           
            this.$emit('ok',{choice:this.oChoice, reason:this.aReason})
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