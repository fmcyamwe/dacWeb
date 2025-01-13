import { api } from 'boot/axios'
import { dacOdacStore } from '../../stores/dacOdac'  //prolly not needed

// emulate 'SELECT count(*) FROM ...WHERE...'
export function getPatientsCount() { //token most def //entity >> for Patients vs Doctors ...maybe
    return api.get(`/patients/count`).then((response) => {
      console.log("getPatientsCount::response>> ",response.data)
      return response.data
    }).catch((error) => {
      console.log("getPatientsCount::Error",error)
      throw new Error("Whoops! "+error.message)
    })
    //,{
        //headers: {'Authorization': `Bearer ${this.apiToken}`},//need auth!!
      //})
}

export function getDoctorsCount() { //token most def //entity >> for Patients vs Doctors ...maybe
  return api.get(`/doctors/count`).then((response) => {
    console.log("getDoctorsCount::response>> ",response.data)
    return response.data
  })//,{
    //headers: {'Authorization': `Bearer ${this.apiToken}`},//need auth!!
  //})
}

export function searchPatientByName(first,last) { //token most def?
  const url = `patients/search?firstname=${first}&lastname=${last}` 

  console.log("searchPatientByName", url) //patients/search?firstname=flo&lastname=Flo%20flo'
  return api.get(`/doctors/count`).then((response) => {
    console.log("searchPatientByName::response>> ",response.data)
    return response.data
  })//,{
    //headers: {'Authorization': `Bearer ${this.apiToken}`},//need auth!!
  //})
}

export function listDoctorsBySpeciality(speciality) {
  const url = `/doctors/speciality?q=${speciality}`
  return api.get(url)
}

export function doApiCheck() {//niice return can be chained at call site!!
  console.log("doApiCheck")
  return api.get('/connect')
}

export function anotherApiCheck() {//toTest if better than above?....
  return api.get('/connect').then((response) => {
    console.log("anotherApiCheck::response>> ",response.data)
    return response.data
  }).catch((error) => {
    console.log("anotherApiCheck::Error",error)
    throw new Error("Whoops! "+error.message) //toSee
  })
}

export function getDocInfo(docId, token) {
  const url = `/doctors/${docId}`
 
  return api.get(url,{//need auth!!
    headers: {'Authorization': `Bearer ${token}`},
  })
}

export function anotherGetDocInfo(docId, token) { //huh just as good!! just gotta be careful with return of response.data!!
  const url = `/doctors/${docId}`
 
  return api.get(url,{//need auth!!
    headers: {'Authorization': `Bearer ${token}`},
  }).then((response) => {
    console.log("anotherGetDocInfo::response>> ",response.data)
   
    return response.data
  }).catch((error) => {
    console.log("anotherGetDocInfo::Error",error)
    throw new Error("Whoops! "+error.message)
  })
}

export function fetchAllPatients(token,pSize,pIndex) {
  if(!token){
    console.log("fetchAllPatients::no token",token)
    return //todo* throw error?
  }

  const url = `/patients?PageSize=${pSize ?? 10}&PageIndex=${pIndex ?? 0}` //umm toReview defaults
  
  return api.get(url,{
    headers: {'Authorization': `Bearer ${token}`},
  })
}

export function fetchDoctors() {
  const url = `/doctors?PageSize=10&PageIndex=0`

  return api.get(url)   
  .then((response) => {
    console.log("fetchDoctors::response",response.data)
    return response.data 
  }).catch((error) => {
    console.log("fetchDoctors::Error",error)
    throw new Error("Whoops! "+error.message)
  })
}

export function fetchOwnPatients(doctorId, token) { //,pSize,pIndex 

  const url = `/doctors/${doctorId}/patients`

  return api.get(url,{
    headers: {'Authorization': `Bearer ${token}`},
  })
}

export function fetchDocPendingRequests(doctorId, token) {
  const url = `/doctors/${doctorId}/requests`
  return api.get(url,{
    headers: {'Authorization': `Bearer ${token}`},
  })
}

/*

export function applyClasses (event, type) {
  const isHeader = type === 'header'
  const bgC = event.bgcolor ? 'bg-'+event?.bgcolor?.toLocaleLowerCase() : 'bg-black'  //oldie >> bg-${ event?.bgcolor?.toLocaleLowerCase() }`
  return {
    [ `text-white ${bgC}` ]: true, // >>account for colors with uppercased first letter..could also add # between 1 & 14 added at end...toSee**
      'full-width': !isHeader && (!event.side || event.side === 'full'),
      'left-side': !isHeader && event.side === 'left',
      'right-side': !isHeader && event.side === 'right',
      'rounded-border': true
  }
}

export function deepCopy(obj) { //deep copy object
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
  
    if (Array.isArray(obj)) {
      return obj.map(item => deepCopy(item));
    }
  
    const copied = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        copied[key] = deepCopy(obj[key]);
      }
    }
  
    return copied;
}
*/