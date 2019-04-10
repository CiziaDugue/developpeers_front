import Vue from 'vue'
import Router from 'vue-router'
import DashboardComponent from '@/components/DashboardComponent.vue'
import PostsListComponent from '@/components/PostsListComponent.vue'
import PostSingleComponent from '@/components/PostSingleComponent.vue'
import GroupsListComponent from '@/components/GroupsListComponent.vue'
import LoginComponent from '@/components/LoginComponent.vue'
import RegisterComponent from '@/components/RegisterComponent.vue'
import ProfileComponent from '@/components/ProfileComponent.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL + '/developpeers_front/dist',
    routes: [
        {
            path: '/articles/:postsListType',
            name: 'postsList',
            component: PostsListComponent,
            // children: [{
            //     path: ':postId',
            //     name: 'postSingle',
            //     component: PostSingleComponent
            // }]
        },
        // {
        //     path: '/mes-articles',
        //     name: 'usersPosts',
        //     component: PostsListComponent
        // },
        {
            path: '/article/:postId',
            name: 'postSingle',
            component: PostSingleComponent
        },
        {
            path: '/tous-les-groupes',
            name: 'groupsList',
            component: GroupsListComponent
        },
        {
            path: '/mes-groupes',
            name: 'usersGroups',
            component: GroupsListComponent
        },
        {
          path: '/login',
          name: 'login',
          component: LoginComponent
        },
        {
          path: '/register',
          name: 'register',
          component: RegisterComponent
        },
        {
          path: '/profil',
          name: 'profile',
          component: ProfileComponent
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import( /* webpackChunkName: "about" */ './views/About.vue')
        }
    ]
})
