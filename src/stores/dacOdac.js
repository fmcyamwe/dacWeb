import { defineStore } from 'pinia'
import { useQuasar } from 'quasar'
import { computed } from 'vue'

//using arrow as in gPlanner--dont like state and getters
export const dacOdacStore = defineStore('dacOdacStore', () => {
    const $q = useQuasar()

    const getToken = computed(() => { //um computed needed
        return JSON.parse($q.localStorage.getItem("Token"))
    })

    function upToken(){ //up to date token toTest**
        return JSON.parse($q.localStorage.getItem("Token"))
    }
    function saveToken(token) {
        $q.localStorage.set('Token', JSON.stringify(token))
    }
    function deleteToken(){
        $q.localStorage.removeItem('Token')
    }

    return {
        getToken,
        saveToken,
        upToken,
        deleteToken
    }
});
