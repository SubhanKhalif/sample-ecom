import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../pages/Home.vue')
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('../pages/Products.vue')
      },
      {
        path: 'product/:id',
        name: 'ProductDetails',
        component: () => import('../pages/ProductDetails.vue')
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('../pages/Cart.vue')
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('../pages/Checkout.vue')
      },
      {
        path: 'wishlist',
        name: 'Wishlist',
        component: () => import('../pages/Wishlist.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
