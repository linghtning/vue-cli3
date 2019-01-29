import {syncRouter, asyncRouter,router } from '@/router/index'
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouter, roles) {
  asyncRouter.map((item)=>{
    roles.forEach((inItem)=>{
      if(item.path==inItem.path){
        if(item.children&&inItem.children){
          item.children=filterAsyncRouter(item.children,inItem.children)
        }
        item.meta=inItem.meta;
      }
    })
  })
  return asyncRouter;
}

const user = {
  state: {
    token:'',
    routers: syncRouter,
    addRouters: []
  },
  mutations: {
    setToken(state,token){
      state.token=token;
    },
    setAuthInfo(state,theAsyncRouter){
      state.addRouters = theAsyncRouter
      for(let i=0;i<theAsyncRouter.length;i++){
        // syncRouter.push(theAsyncRouter[i]);
        router.options.routes.push(theAsyncRouter[i]);
      }
      router.addRoutes(theAsyncRouter);
      state.routers = syncRouter;
      console.log(state.routers)
    }
  },
  actions: {
    setToken({ commit }, token) {
      commit('setToken', token)
    },
    setAuthInfo({commit},data){
      console.log(data)
      let theAsyncRouter = filterAsyncRouter(asyncRouter,data)
      commit('setAuthInfo',theAsyncRouter)
    }

  }

}

export default user
