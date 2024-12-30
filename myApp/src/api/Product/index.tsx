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

//查找单个商品
function SearchOnlyAPI(name:string){
    return request ({
        url: `/product/name`,
        method: 'GET',
        params:{
            name,
        }
    })
}


//2.商品更新请求
function ProductUpdateAPI(id: number, data:ProductForm){
    return request ({
        url: `/product/${id}`,  // 后端接口的 URL，包括产品 ID
        method: 'PATCH',
        data, // 请求体，包含更新的数据
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

//4.商品删除
 function ProductDeleteAPI(id: number){
    return request ({
        url: `/product/${id}`,
        method: 'DELETE',
    })
}
export {ProductFormAPI,ProductCreateAPI,ProductUpdateAPI,SearchProductAPI,SearchOnlyAPI,ProductDeleteAPI}