//登录
interface LoginForm {
    username: string;
    password: string;
   
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


export type {LoginForm,RegisterForm,ProductForm}