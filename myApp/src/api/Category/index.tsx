import { CategoryForm } from "../../type"
import { request  } from "../../utils"

//获取分类列表

function CategoryListAPI(){
    return request({
        url: '/category',
        method: 'GET',
    })
}



//新增分类
function CategoryCreateAPI(data: CategoryForm){
    return request ({
        url: '/category',
        method: 'POST',
        data,
    })
}
export { CategoryCreateAPI,CategoryListAPI } 