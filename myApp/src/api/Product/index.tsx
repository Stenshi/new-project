//商品相关的所有请求
import { ProductForm } from "../../type"
import { request  } from "../../utils"

//1.商品表单请求
function ProductFormAPI(){
    return request ({
        url: '/product',
        method: 'GET',
        
    })
}

//模糊查找商品
function SearchProductAPI(data:string){
    return request ({
        url: '/product/search',
        method: 'GET', 
        params:{
            name:data
        }
    })
}

//查询单个商品
function SearchOnlyAPI(data:string){
    return request ({
        url: '/product/name',
        method: 'GET', 
        params:{
            name:data
        }
    })
}


//2.商品更新请求
function ProductUpdateAPI(){
    return request ({
        url: '/product',
        method: 'GET',
        
    })
}

//3.商品新增请求
function ProductCreateAPI(data:ProductForm){
    return request ({
        url: '/product',
        method: 'POST',
        data,
    })
}

export {ProductFormAPI,ProductCreateAPI,ProductUpdateAPI,SearchProductAPI,SearchOnlyAPI}