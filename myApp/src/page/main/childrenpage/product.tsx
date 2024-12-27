import React, { useEffect, useRef, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Radio, Upload, Row, Col } from "antd";
import { ProductFormAPI, SearchOnlyAPI, SearchProductAPI } from "../../../api/Product";
import { PlusOutlined } from "@ant-design/icons";
import { ProductCreateAPI } from "../../../api/Product";
const Product = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  useEffect(() => {
    //请求商品数据
    const getProduct = async () => {
      const res = await ProductFormAPI();
      setProducts(res.data);
    };
    getProduct();
  },[]);

   

  // 表格列配置
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "名称", dataIndex: "name", key: "name" },
    { title: "图片", 
        dataIndex: "imageUrl",
         key: "imageUrl" ,
         render:(text =>{
            return(
            <img src={text} alt="图片" style={{width:100,height:100}} />
         )})},
    { title: "描述", dataIndex: "description", key: "description" },
    { title: "价格", dataIndex: "price", key: "price" },
    { title: "库存量", dataIndex: "stock", key: "stock" },
    { title: "创建时间", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "操作",
      key: "action",
      render: ( record) => (
        <>
          <Button
            onClick={() => handleEditProduct(record)}
            style={{ marginRight: 8 }}
          >
            编辑
          </Button>
          <Button onClick={() => handleDeleteProduct(record.id)} danger>
            删除
          </Button>
        </>
      ),
    },
  ];

  // 添加商品
  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalVisible(true);
  };
   //回显图片列表
  const [fileList,setfileList] =useState([]);
  // 编辑商品,回填信息
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalVisible(true);
        // 回填封面图片
        if(product.imageUrl){
            const initialFileList = [
                {
                  uid: '-1',  // 必须是唯一标识
                  name: 'image1.jpg',
                  status: 'done',
                  url: product.imageUrl, // 服务器返回的图片 URL
                }]
            setImageList(product.imageUrl) // 封面list
            setfileList(initialFileList) 
            setImageType(1)
             //回填表单信息
            form.setFieldsValue({...product,type:1});
        }else{
            setImageType(0)
             //回填表单信息
            form.setFieldsValue({...product,type:0});
        }
  };

  // 删除商品
  const handleDeleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
    message.success("商品删除成功");
  };
  

  // 提交表单
  const handleOk = async (values) => {
    if (editingProduct) {
      // 更新商品
      setProducts(
        products.map((product) => (product.id === values.id ? values : product))
      );
      message.success("商品更新成功");
    } else {
      // 添加商品
      const productForm = {
        name: values.name,
        description: values.description,
        price: parseFloat(values.price),
        stock: parseInt(values.stock),
        imageUrl: imageList.map(item =>item.thumbUrl)[0], // 图片上传后返回的url
        userId:1
    }
    
      await ProductCreateAPI(productForm)
      const res = await ProductFormAPI();
      setProducts(res.data);
      message.success("商品添加成功");
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); //关闭表单时，清除表单信息
  };
   
   //图片

   // 图片上传
  
  const [imageList, setImageList] = useState([])
    //图片上传过程  
    const onUploadChange = (info) => {
        //将上传的文件信息，传入list中
        setImageList(info.fileList)
        
    }
    
  // 控制图片Type
  const [imageType, setImageType] = useState(0)
  // 无图，单图控制
  const onTypeChange = (e) => {
    const type = e.target.value
    setImageType(type)
  }

  
  



  //搜索框
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);

  };


  const handleSearch = async() => {
    console.log(searchValue)
    const res = await SearchProductAPI(searchValue);
    setProducts(res.data);
  };

  //创建一个表单实例
  const [form] = Form.useForm();

  
  return (
    <div>
      <Row gutter={16}>
        {/* 按钮 */}
        <Col>
          <Button
            type="primary"
            onClick={handleAddProduct}
            style={{ marginBottom: 16 }}
          >
            添加商品
          </Button>
        </Col>

        {/* 搜索框 */}
        <Col>
          <Input.Search
            placeholder="搜索商品"
            value={searchValue}
            onChange={handleSearchChange}
            onSearch={handleSearch}
            enterButton="搜索"  // 你可以自定义按钮文字
            style={{ width: 300, marginBottom: 16 }} // 设置输入框宽度
          />
        </Col>
      </Row>
      <Table
        dataSource={products} //导入商品数据
        columns={columns} //导入列表
        rowKey="id"
        pagination={false}
      />

      {/* 编辑/添加商品模态框 */}
      <Modal
        title={editingProduct ? "编辑商品" : "添加商品"}
        open={isModalVisible} //用来控制模态框是否显示，ture为显示
        onCancel={handleCancel} //当模态框关闭时自动执行的回调函数，将isModalVisible改为false
        footer={null}
      >
        <Form
        //绑定表单实例
          form={form}
          onFinish={handleOk}
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: "请输入商品名称" },
                editingProduct ? {required: true, 
                    message: "商品名已存在,不能重复添加", 
                    //自定义验证器
                    validator: async (_, value) => {
                    // 这里执行异步检查商品名是否存在的逻辑
                    const isNameExist = await SearchOnlyAPI(value);
                    if (isNameExist.data.data.name===value) {
                        return Promise.reject('商品名已存在');
                    }}}:{required: true, 
                        message: "商品名已存在,不能重复添加", 
                        //自定义验证器
                        validator: async (_, value) => {
                        // 这里执行异步检查商品名是否存在的逻辑
                        const isNameExist = await SearchOnlyAPI(value);
                    
                        if (isNameExist.data.message!=='') {
                            return Promise.reject('商品名已存在');
                        }}}
                ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type" noStyle>
              <Radio.Group onChange={onTypeChange} defaultValue={0} value={imageType} >
                <Radio value={1}>单图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imageType > 0 &&
             <Upload
             name="image"
             listType="picture-card"
             maxCount={imageType}  //最大上传数量
             showUploadList
             fileList={fileList}  // 回显上传的图片
             onChange={onUploadChange} //onChange 属性用于监听文件上传状态的变化，上传图片的url等
           >
              <div style={{ marginTop: 8 }}>
                <PlusOutlined />
              </div>
            </Upload>}
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: "请描述商品" }]}
          >
            <Input type="text" />
          </Form.Item>

          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: "请输入商品价格" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="stock"
            label="库存"
            rules={[{ required: true, message: "请输入商品库存" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Product;
