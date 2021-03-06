import Vue from 'vue'
import Router from 'vue-router'
import DashboardComponent from '@/components/DashboardComponent.vue'
import PostsListComponent from '@/components/PostsListComponent.vue'
import PostSingleComponent from '@/components/PostSingleComponent.vue'
import GroupsListComponent from '@/components/GroupsListComponent.vue'
import LoginComponent from '@/components/LoginComponent.vue'
import RegisterComponent from '@/components/RegisterComponent.vue'
import ProfileComponent from '@/components/ProfileComponent.vue'
import HomeComponent from '@/components/HomeComponent.vue'
import CreateGroupComponent from '@/components/CreateGroupComponent.vue'
import CreatePostComponent from '@/components/CreatePostComponent.vue'
import CreateVersionComponent from '@/components/CreateVersionComponent.vue'
import EditVersionComponent from '@/components/EditVersionComponent.vue'
import PostSingleGuestComponent from '@/components/PostSingleGuestComponent.vue'
import OupsComponent from '@/components/OupsComponent.vue'
import UserPublicProfileComponent from '@/components/UserPublicProfileComponent.vue'

Vue.use(Router)

export default new Router({
    //mode: 'history',
    //base: process.env.BASE_URL + '/developeers_front/dist',
    routes: [{
            path: '/articles/:postsListType',
            name: 'postsList',
            component: PostsListComponent,
        },
        {
            path: '/article/:postId',
            name: 'postSingle',
            component: PostSingleComponent
        },
        {
            path: '/article/:postId/:versionId',
            name: 'notificatedPost',//il faudrait changer ce nom de route car la route sert à d'autres choses aussi
            component: PostSingleComponent
        },
        {
            path:'/guest/article/:postId',
            name:'guestPostSingle',
            component: PostSingleGuestComponent
        },
        {
            path: '/groupes/:groupsListType',
            name: 'groupsList',
            component: GroupsListComponent,
        },
        {
            path: '/groupe/:groupId',
            name: 'groupPostsList',
            component: PostsListComponent
        },
        {
          path: '/creer-un-groupe',
          name: 'createGroup',
          component: CreateGroupComponent
        },
        {
          path: '/creer-un-article',
          name: 'createPost',
          component: CreatePostComponent
        },
        {
          path: '/creer-un-article/:groupId',
          name: 'createPostFromGroup',
          component: CreatePostComponent
        },
        {
          path: '/creer-une-version/:postId',
          name: 'createVersion',
          component: CreateVersionComponent
        },
        {
          path: '/editer-une-version/:postId/:versionId',
          name: 'editVersion',
          component: EditVersionComponent
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
            path: '/public-page/:userName/:userId',
            name: 'userPublicProfile',
            component: UserPublicProfileComponent
        },
        {
            path: '/',
            name: 'home',
            component: HomeComponent
        },
        {
            path: '/search/:words',
            name: 'searchPosts',
            component: HomeComponent
        },
        {
            path: '/oups',
            name: 'oups',
            component: OupsComponent
        }
        // {
        //     path: '/about',
        //     name: 'about',
        //     // route level code-splitting
        //     // this generates a separate chunk (about.[hash].js) for this route
        //     // which is lazy-loaded when the route is visited.
        //     component: () => import( /* webpackChunkName: "about" */ './views/About.vue')
        // }
    ]
})
