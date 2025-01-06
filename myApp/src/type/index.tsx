//登录
interface LoginForm {
    username: string;
    password: string;
    captcha: string;
  }

//注册
  interface RegisterForm extends LoginForm {
    email: string;
  }


//商品表单
interface ProductForm {
    
    "name": "string",
    "description": "string",
    "price":number,
    "stock": number,
    "imageUrl": "string",
    "userId": number
}

//商品分类表单
  interface CategoryForm {
    "name": "string",
    "description": string | null;
    "parentId": number | null;
  }


export type {LoginForm,RegisterForm,ProductForm,CategoryForm}