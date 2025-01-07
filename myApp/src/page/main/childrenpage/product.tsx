import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Radio,
  Upload,
  Row,
  Col,
  Popconfirm,
  Cascader,
  Pagination,
} from "antd";
import {
  ProductDeleteAPI,
  ProductFormAPI,
  ProductUpdateAPI,
  SearchCategoryAPI,
  SearchOnlyAPI,
  SearchProductAPI,
} from "../../../api/Product";
import { PlusOutlined } from "@ant-design/icons";
import { ProductCreateAPI } from "../../../api/Product";
import { CategoryAPI, CategoryListAPI } from "../../../api/Category";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); //编辑表单列表
  const [Kindlist, setKindlist] = useState([]); // 所有分类数据

  const [currentPage, setCurrentPage] = useState(1); // 当前页
  const [pageSize, setPageSize] = useState(5); // 每页显示的数据条数

  //获取分类列表，无子结构
  const [categoriesAll, setCategoriesAll] = useState([]);
  useEffect(() => {
    //请求商品数据
    const getProduct = async () => {
      const res = await ProductFormAPI();
      setProducts(res.data);
      //获取分类数据，有子结构
      const kinds = await CategoryListAPI();
      setKindlist(kinds.data);
      // 获取所有分类数据，无子结构
      const AllKind = await CategoryAPI();
      setCategoriesAll(AllKind.data);
    };

    getProduct();
  }, []);

  // 计算当前页的数据
  const currentData = useMemo(() => {
    return products.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [currentPage, products, pageSize]);

  // 分页器页码改变回调
  const onPageChange = (page, pageSize) => {
    setCurrentPage(page); // 更新当前页
    setPageSize(pageSize); // 更新每页条数
  };

  // 表格列配置
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "名称", dataIndex: "name", key: "name" },
    {
      title: "图片",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text) => {
        return (
          <img src={text} alt="图片" style={{ width: 100, height: 100 }} />
        );
      },
    },
    {
      title: "分类",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (text) => {
        const category = categoriesAll.find((item) => item.id === text); // 查找匹配的分类
        return category ? category.name : text; // 如果找到匹配的项，则返回名称，否则返回原始值
      },
    },
    { title: "描述", dataIndex: "description", key: "description" },
    { title: "价格", dataIndex: "price", key: "price" },
    { title: "库存量", dataIndex: "stock", key: "stock" },
    { title: "创建时间", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "操作",
      key: "action",
      render: (record) => (
        <>
          <Button
            onClick={() => handleEditProduct(record)} //包含这一行的数据
            style={{ marginRight: 8 }}
          >
            编辑
          </Button>
          {/* 气泡确认框 */}
          <Popconfirm
            title="删除商品"
            description="确认删除该商品吗?"
            cancelText="否"
            okText="是"
            onConfirm={() => handleDeleteProduct(record.id)}
          >
            <Button danger>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  // 添加商品
  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalVisible(true);
  };

  // 编辑商品,回填信息
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalVisible(true);
    //设置分类选项
    const selectKind = product.categoryId
      ? categoriesAll.find((c) => c.id === product.categoryId)?.name
      : "无";
    // 回填封面图片
    if (product.imageUrl) {
      setImageList(product.imageUrl); // 封面list
      const initialFileList = [
        {
          uid: "-1", // 必须是唯一标识
          name: "image1.jpg",
          status: "done",
          url: product.imageUrl, // 服务器返回的图片 URL
        },
      ];
      setImageList(initialFileList);
      setImageType(1);
      //回填表单信息
      form.setFieldsValue({
        ...product,
        categoryId: [product.categoryId, selectKind],
        type: 1,
      });
    } else {
      setImageType(0);
      //回填表单信息
      form.setFieldsValue({
        ...product,
        categoryId: [product.categoryId, selectKind],
        type: 0,
      });
    }
  };

  // 删除商品
  const handleDeleteProduct = async (id: number) => {
    await ProductDeleteAPI(id);
    const res = await ProductFormAPI();
    setProducts(res.data);
    message.success("商品已删除");
  };

  // 提交表单
  const handleOk = async (values) => {
    console.log(values)
    //表单结构
    const productForm = {
      name: values.name,
      description: values.description,
      price: parseFloat(values.price),
      stock: parseInt(values.stock),
      categoryId: parseInt(values.categoryId[values.categoryId.length-1])?parseInt(values.categoryId[values.categoryId.length-1]):parseInt(values.categoryId[0]),
      imageUrl: imageType ? imageList[0].url : "", // 图片上传后返回的url
      userId: parseInt(localStorage.getItem('userid')),
    };
    if (editingProduct) {
      // 更新商品
      await ProductUpdateAPI(values.id, productForm);
      const res = await ProductFormAPI();
      setProducts(res.data);
      handleCancel();
      message.success("商品更新成功");
    } else {
      // 添加商品
      await ProductCreateAPI(productForm);
      const res = await ProductFormAPI();
      setProducts(res.data);
      handleCancel();
      message.success("商品添加成功");
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setImageList([]);
    setImageType(null); //清空image表和type值恢复到无图
    form.resetFields(); //关闭表单时，清除表单信息
  };

  //图片

  // 图片上传

  const [imageList, setImageList] = useState([]);

  //图片上传过程
  const onUploadChange = (info) => {
    // 获取当前的文件列表，避免每次重置为新数组
    let fileList = [...info.fileList];

    // 处理文件上传成功后的回调
    if (info.file.status === "done") {
      // 上传成功后，更新文件的 URL
      fileList = fileList.map((file) =>
        file.uid === info.file.uid
          ? { ...file, url: file.response?.url || file.url } // 更新文件的 URL
          : file
      );
    }

    // 处理文件删除后的回调
    if (info.file.status === "removed") {
      //filter() 方法会返回一个新的数组，使用它过滤掉要删除的文件
      fileList = fileList.filter((file) => file.uid !== info.file.uid);
    }

    console.log(fileList);
    setImageList(fileList);
  };

  // 控制图片Type
  const [imageType, setImageType] = useState(0);
  // 无图，单图控制
  const onTypeChange = (e) => {
    const type = e.target.value;
    setImageType(type);
  };

  //搜索框
  const [searchValue, setSearchValue] = useState("");
  const [timer, setTimer] = useState<NodeJS.Timeout| null>(null); // 用于存储定时器 ID

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    // 清除之前的定时器
    if (timer) {
      clearTimeout(timer);
    }

    // 设置新的定时器
    const newTimer = setTimeout(async () => {
      //当检测到输入框为空时，0.5s后重新请求列表数据并渲染
      if (!value) {
        const res = await ProductFormAPI(); // 你的 API 请求
        setProducts(res.data);
      }
    }, 500); // 500ms 后执行

    // 存储新的定时器
    setTimer(newTimer);
  };
  //点击搜索
  const handleSearch = async () => {
    const res = await SearchProductAPI(searchValue);
    //重置类别搜索框
    setSelectedCategory([]);
    setProducts(res.data);
    setCurrentPage(1);
  };

  //分类查询
  //分类项

  const categories = useMemo(() => {
    // 转换函数
    const transformDataToOptions = (data) => {
      return data.map((item) => {
        return {
          value: item.id,
          label: item.name,
          children: item.children ? transformDataToOptions(item.children) : [],
        };
      });
    };
    const parentkind = transformDataToOptions(Kindlist);
    return parentkind;
  }, [Kindlist]);

  // 用来保存 Cascader 选择的值
  const [selectedCategory, setSelectedCategory] = useState([]);

  // Cascader 选择变化时的处理函数
   // 声明 state 类型为 NodeJS.Timeout
   
  const handleCategoryChange = async (value) => {
    setSelectedCategory(value); // 更新选中的分类
    // 清除之前的定时器
    if (timer) {
      clearTimeout(timer);
    }
    
    // 设置新的定时器
    const newTimer = setTimeout(async () => {
      //当检测到输入框为空时，0.5s后重新请求列表数据并渲染
      if (!value) {
        const res = await ProductFormAPI();
        setProducts(res.data);
      }
    }, 500); // 500ms 后执行

    // 存储新的定时器
    setTimer(newTimer);
  };

  //点击分类查询按钮
  const categoriesSearch = async (value: string[]) => {
    if (value) {
      const res = await SearchCategoryAPI(parseInt(value[value.length - 1]));
      setSearchValue("");
      setProducts(res.data);
      setCurrentPage(1);
    } else {
      const res = await ProductFormAPI();
      setProducts(res.data);
      setSearchValue("");
    }
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
            enterButton="搜索" // 你可以自定义按钮文字
            style={{ width: 300, marginBottom: 16 }} // 设置输入框宽度
          />
        </Col>

        <Col>
          {/* 分类查询 */}
          {/* Cascader */}
          <Cascader
            value={selectedCategory} // 绑定选中的值
            options={categories}
            changeOnSelect
            displayRender={(label) => label[label.length - 1]} // 只显示最后选择的分类（子分类）
            onChange={handleCategoryChange} // 绑定选中变化事件
          />
          <Button
            type="primary"
            onClick={() => categoriesSearch(selectedCategory)}
          >
            分类查询
          </Button>
        </Col>
      </Row>
      <Table
        dataSource={currentData} //导入商品数据
        columns={columns} //导入列表
        rowKey="id"
        pagination={false} //关闭默认分类
      />

      {/* 分页器 */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={products.length} //总条数
        onChange={onPageChange}
        showTotal={(total) => `总共 ${total} 条`}
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
          {/* 隐藏 id */}
          <Form.Item name="id" style={{ display: "none" }}>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="名称"
            rules={[
              { required: true, message: "请输入商品名称" },
              editingProduct
                ? {
                    required: true,
                    message: "商品名已存在,不能重复添加",
                    //自定义验证器,每当输入值发生变化时触发
                    validator: async (_, value) => {
                      // 这里执行异步检查商品名是否存在的逻辑
                      const isNameExist = await SearchOnlyAPI(value);
                      if (
                        isNameExist.data.message !== "" &&
                        value !== editingProduct.name
                      ) {
                        return Promise.reject("商品名已存在");
                      }
                    },
                  }
                : {
                    required: true,
                    message: "商品名已存在,不能重复添加",
                    //自定义验证器
                    validator: async (_, value) => {
                      // 这里执行异步检查商品名是否存在的逻辑
                      const isNameExist = await SearchOnlyAPI(value);

                      if (isNameExist.data.message !== "") {
                        return Promise.reject("商品名已存在");
                      }
                    },
                  },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="商品图片">
            <Form.Item name="type" noStyle>
              <Radio.Group
                onChange={onTypeChange}
                defaultValue={0}
                value={imageType}
              >
                <Radio value={1}>单图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imageType > 0 && (
              <Upload
                name="image"
                action={"http://localhost:3000/product/upload"} // 后端上传的 URL
                listType="picture-card"
                maxCount={imageType} //最大上传数量
                showUploadList
                fileList={imageList} // 上传的图片显示
                onChange={onUploadChange} //onChange 属性用于监听文件上传状态的变化，上传图片的url等
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: "请描述商品" }]}
          >
            <Input type="text" />
          </Form.Item>

          <Form.Item
            label="类别"
            name="categoryId"
            rules={[{ required: true, message: "请选择商品类别" }]}
          >
            <Cascader
              options={categories}
              changeOnSelect
              displayRender={(label) => label[label.length - 1]} // 只显示最后选择的分类（子分类）
            />
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
