import Vue from 'vue'
import Router from 'vue-router'
import DashboardComponent from '@/components/DashboardComponent.vue'
import PostsListComponent from '@/components/PostsListComponent.vue'
import GroupsListComponent from '@/components/GroupsListComponent.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'dashboard',
            component: DashboardComponent
        },
        {
            path: '/tous-les-articles',
            name: 'postsList',
            component: PostsListComponent
        },
        {
            path: '/mes-articles/:userId',
            name: 'usersPosts',
            component: PostsListComponent
        },
        // {
        //     path: '/article/:postId',
        //     name: 'postSingle',
        //     component: PostSingleComponent
        // },
        {
            path: '/tous-les-groupes',
            name: 'groupsList',
            component: GroupsListComponent
        },
        {
            path: '/mes-groupes/:userId',
            name: 'usersGroups',
            component: GroupsListComponent
        },
        // {
        //     path: '/groupes/:groupId',
        //     name: 'groupSingle',
        //     component: GroupSingleComponent
        // },
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
