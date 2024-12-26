import React, { useEffect, useRef, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Radio, Upload } from "antd";
import { ProductFormAPI } from "../../../api/Product";
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
      console.log(res.data);
    };
    getProduct();
  }, []);
  // 表格列配置
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "名称", dataIndex: "name", key: "name" },
    { title: "图片", 
        dataIndex: "imageUrl",
         key: "imageUrl" ,
         render:(text =>{
            console.log(text)
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
      render: (text, record) => (
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

  // 编辑商品
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalVisible(true);
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
      
      const res  = await ProductCreateAPI(productForm)
      message.success("商品添加成功");
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
   
   //图片

   // 图片上传
  const cacheImageList = useRef([]) 
  const [imageList, setImageList] = useState([])
    //图片上传过程  
    const onUploadChange = (info) => {
        //将上传的文件信息，传入list中
        setImageList(info.fileList)
        //使用useRef将图片列表存贮起来
        cacheImageList.current = info.fileList
    }
    
  // 控制图片Type
  const [imageType, setImageType] = useState(0)
  // 无图，单图控制
  const onTypeChange = (e) => {
    const type = e.target.value
    setImageType(type)
    if (type === 1) {
      // 单图，截取第一张展示，存入图片列表中
      const imgList = cacheImageList.current[0] ? [cacheImageList.current[0]] : []
      setImageList(imgList)
    } 
  }
  
   
  return (
    <div>
      <Button
        type="primary"
        onClick={handleAddProduct}
        style={{ marginBottom: 16 }}
      >
        添加商品
      </Button>
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
          initialValues={editingProduct || {}} //用来指定表单初始值。
          onFinish={handleOk}
        >
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: "请输入商品名称" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange} defaultValue={0}>
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
             action={'http://localhost:3000/product/upload'}
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
