//商品相关的所有请求
import { request  } from "../../utils"
interface ProductForm {
    
        "name": "string",
        "description": "string",
        "price": 0,
        "stock": 0,
        "imageUrl": "string",
        "userId": 0
}
//1.商品表单请求
function ProductFormAPI(){
    return request ({
        url: '/product',
        method: 'GET',
        
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
function ProductCreateAPI(data){
    return request ({
        url: '/product',
        method: 'POST',
        data,
    })
}

export {ProductFormAPI,ProductCreateAPI,ProductUpdateAPI}