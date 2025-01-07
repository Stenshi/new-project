import { CategoryForm } from "../../type"
import { request  } from "../../utils"

//获取分类列表
function CategoryAPI(){
    return request ({
        url: '/category/list',
        method: 'GET',
        
    })
}



//获取分类和子类列表

function CategoryListAPI(){
    return request({
        url: '/category',
        method: 'GET',
    })
}

//按分类名查询分类
function SearchcategoryListAPI(name:string){
    return request({
        url: `/category/${name}`,
        method: 'GET',
    })
}

// 按分类名查询单个分类

function CategorySingleAPI(name: string) {
    console.log('Sending request with name:', name);
    return request({
      url: '/category/findByName',
      method: 'GET',
      params: {
        name,
      },
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

//更新分类

function CategoryUpdateAPI(id: number, data: CategoryForm){
    return request ({
        url: `/category/${id}`,  // 后端接口的 URL，包括产品 ID
        method: 'PATCH',
        data, // 请求体，包含更新的数据
    })
}

//4.商品分类删除
function CategoryDeleteAPI(id: number){
    return request ({
        url: `/category/${id}`,
        method: 'DELETE',
    })
}
export { CategoryCreateAPI,CategoryListAPI,SearchcategoryListAPI,CategoryUpdateAPI,CategoryAPI,CategoryDeleteAPI,CategorySingleAPI} 