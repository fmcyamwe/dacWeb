<template>
  <q-dialog v-model="showDialog" transition-show="rotate" transition-hide="rotate" no-esc-dismiss @before-hide="$emit('gonHide')">
    <q-card>
      <div class="text-h6 q-mx-xs">Login As </div>
      <q-input
        v-model="aLogin"
        filled
        label="Name"
        lazy-rules
        item-aligned
        :rules="[(val) => (val && val.length > 1) || 'Login cannot be empty']"
      />
      
      <q-input
        filled
        v-model="aPassword"
        label="Password"
        type="password"
        class="col q-mx-sm q-pa-md"
      />

      <!--<q-btn-dropdown
      color=""
      text-color="teal"
      elevated
      no-caps
      label="Login As"
      >
          <q-list>
              <q-item v-for="e in loginOptions" 
              :key="e.title" 
              clickable
              :to="e.link"
              @click="onSelect(e.title)" v-close-popup>
                  <q-item-section>
                      <q-item-label>{{ e.title }}</q-item-label>
                  </q-item-section>
              </q-item>
          </q-list>
      </q-btn-dropdown>
    -->
    <q-separator dark />
    <q-card-actions align="center" class="q-mx-md"><!-- class="q-gutter-md q-mx-md inputBtn" icon="delete_forever" icon="check_circle"-->
            <q-btn
            label="Cancel"
            flat 
            color="primary"
            @click="{{ console.log('euuh cancel?'); }}"
            />
            <q-separator :vertical="true"/>
            <q-btn
            label="Login"
            flat 
            color="primary"
            @click="doLogin"
            /> 
          </q-card-actions>

    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent,ref } from 'vue'

//const loginOptions = ["Patient", "Doctor"]

export default defineComponent ({
  name: 'loginDialog',
  props: {
    randomLogAcct: String //requiered but can be modified....
    //showDefaultOption: Boolean //umm point of this?  //v-model="showDefaultOption" 
    //loginOptions: Array loginId
  },
  setup() {
    return {
      //options: loginOptions,
      show:ref(true), //for default dialog show/hide//true by default...
      loginId: ref(''), //huh still complains >> this.randomLogAcct, //nope>> ref(this.randomLogAcct), //randomLogAcct
      password: ref(''),
    }
  },
  mounted(){
    console.log("loginDialog::mounted>> ", this.randomLogAcct)
  },
  
  emits: [
    'doLoginAs',
    'gonHide'
  ],
  /*mounted(){ //beforeMount
    console.log('huh login as', this.loginOptions)
  },*/
  computed: {
    showDialog:{
      get(){return this.show},
      set(value){
        this.show = value
      }
    },
    aLogin:{
      get(){
        return this.randomLogAcct ? this.randomLogAcct : this.loginId //kinda bad...toChange**
        //return 
        //this.loginId
      },
      set(value){
        this.loginId = value
      }
    },
    aPassword:{
      get(){return this.password},
      set(value){
        this.password = value
      }
    }
  },
  methods: {
    doLogin() {
      console.log('huh doLogin >>', )
      this.$emit('doLoginAs', this.aLogin, this.aPassword)
    }
  }
})
</script>