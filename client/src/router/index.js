import Vue from 'vue'
import Router from 'vue-router'
import LandingPage from '@/components/LandingPage'
import Home from '@/components/Home'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Trips from '@/components/Trips'
import Help from '@/components/Help'
import CreateTrip from '@/components/CreateTrip'
import TripDetails from '@/components/TripDetails'
import Error from '@/components/Error'

import store from '@/store/store'

Vue.use(Router)

function checkLoggedIn (to, from, next) {
  // If user not logged -in, will redirect automatically to login page
  if (!store.getters.isUserLoggedIn) {
    next('/login')
  } else {
    next()
  }
}

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'landingPage',
      component: LandingPage,
      meta: {
        title: 'Welcome to Tripping'
      }
    },
    {
      path: '/map',
      name: 'root',
      component: Home,
      beforeEnter: checkLoggedIn,
      meta: {
        title: 'My Map'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        title: 'Sign up'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        title: 'Login'
      }
    },
    {
      path: '/trips',
      name: 'trips',
      component: Trips,
      beforeEnter: checkLoggedIn,
      meta: {
        title: 'My Trips'
      }
    },
    {
      path: '/help',
      name: 'help',
      component: Help,
      beforeEnter: checkLoggedIn,
      meta: {
        title: 'How to use map'
      }
    },
    {
      path: '/error-lp',
      name: 'errorPage',
      component: Error,
      meta: {
        title: 'Something went wrong'
      }
    },
    {
      path: '/trips-create',
      name: 'trips-create',
      component: CreateTrip,
      beforeEnter: checkLoggedIn,
      meta: {
        title: 'Create new Trip'
      }
    },
    {
      path: '/trip-details/:tripId',
      name: 'trip-details',
      component: TripDetails,
      beforeEnter: checkLoggedIn,
      meta: {
        title: 'My Trip'
      }
    },
    {
      path: '*',
      redirect: '/error-lp',
      meta: {
        title: 'Something went wrong'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
