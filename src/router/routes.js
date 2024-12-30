import MainLayout from 'layouts/MainLayout.vue'
import PatientLayout from 'layouts/PatientLayout.vue'
import DoctorLayout from 'layouts/DoctorLayout.vue'

import IndexPage from 'pages/IndexPage.vue'
import PatientPage from 'pages/PatientPage.vue'
import DoctorPage from 'pages/DoctorPage.vue'

const routes = [
  {
    path: '/',
    alias: '/home',
    component: MainLayout, //() => import('layouts/MainLayout.vue'), 
    children: [
      { path: '', component: IndexPage }//() => import('pages/IndexPage.vue') },
      //{ path: 'patient', component: () => import('pages/PatientPage.vue') },
      //{ path: 'doctor', component: () => import('pages/DoctorPage.vue') }
    ]
  },
  {
    path: '/patient',
    props: {loggedAs: "Patient"},
    component: PatientLayout, //() => import('layouts/MainLayout.vue'), 
    children: [
      { path: '', component: PatientPage}
    ]
  },
  {
    path: '/doctor',
    props: {loggedAs: "Doctor"},
    component: DoctorLayout, //todo** PatientLayout and DoctorLayout are same >>rename and use only layout for connected status
    children: [
      { path: '', component: DoctorPage}
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
