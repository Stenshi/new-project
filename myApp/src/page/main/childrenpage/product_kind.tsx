import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Popconfirm, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { CategoryCreateAPI, CategoryListAPI } from '../../../api/Category';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: '电子产品', description: '手机、电脑等电子产品', parentId: null },
    { id: 2, name: '家居用品', description: '家具、家电等', parentId: null },
    { id: 3, name: '手机', description: '智能手机', parentId: 1 },
    { id: 4, name: '笔记本电脑', description: '高性能笔记本', parentId: 1 },
  ]);
  
  useEffect(()=>{
    //请求分类列表
    const getCategory = async () => {
        const res = await CategoryListAPI();
        setCategories(res.data);
        console.log(res.data);
      };
      getCategory();
  },[])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();


  

  // 打开添加/编辑分类的 Modal
  const showModal = (category = null) => {
    setEditingCategory(category);
    form.resetFields();
    if (category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description,
        parentId: category.parentId,
      });
    } else {
      form.setFieldsValue({
        name: '',
        description: '',
        parentId: null,
      });
    }
    setIsModalVisible(true);
  };

  // 关闭 Modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 提交表单，添加或更新分类
  const handleOk = async () => {
    // 验证表单输入值是否符合规则
    form.validateFields() 

    // 获取整个表单的值
    const values = form.getFieldsValue();
    
        if (editingCategory) {
          // 更新分类
          const updatedCategories = categories.map((category) =>
            category.id === editingCategory.id ? { ...category, ...values } : category
          );
          setCategories(updatedCategories);
          message.success('分类更新成功');
        } else {
          // 添加分类
          await CategoryCreateAPI(values)
          const res = await CategoryListAPI();
          setCategories(res.data);
         
        }
        setIsModalVisible(false);
  };

  // 删除分类
  const handleDelete = (id) => {
    const filteredCategories = categories.filter((category) => category.id !== id);
    setCategories(filteredCategories);
    message.success('分类删除成功');
  };

  // 表格列定义
  const columns = [
    { title: '分类名称', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '父分类', dataIndex: 'parentId', key: 'parentId', render: (parentId:number) => parentId ? categories.find(c => c.id === parentId)?.name : '无' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <Popconfirm
            title="确定删除这个分类吗?"
            onConfirm={() => handleDelete(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
   // 渲染树形结构的表格
   const renderTable = (categories) => {
    
    return categories.map(category => {
        console.log(category.children)
    return({
      key: category.id,
      ...category,
      children: category.children ? renderTable(category.children) : null,
    })});
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>商品分类管理</h2>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
        style={{ marginBottom: 20 }}
      >
        添加分类
      </Button>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={renderTable(categories)} // 渲染层级结构
        pagination={false}
        expandable={{
            //expandable 配置：允许在父分类行中点击展开子分类。
            //expandedRowRender：这是展开行时显示的内容，你已经设置为显示一个嵌套的 Table，显示该行的 children 数据。
            expandedRowRender: (record) => {
                // 展开行时，在该行下方显示一个子表格
              return (
               
                <Table
                  columns={columns}
                  dataSource={record.children || []} // 渲染子分类 
                  pagination={false} // 禁用分页
                  showHeader={false} // 禁用子表格的表头
                  rowKey="id"
                />
               
              );
            },
            // 可选：设置每行展开的默认状态
            defaultExpandedRowKeys: [],
          }}
      />
      <Modal
        title={editingCategory ? '编辑分类' : '添加分类'}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          name="categoryForm"
          initialValues={{ name: '', description: '', parentId: null }}
        >
          <Form.Item
            label="分类名称"
            name="name"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: '请输入分类描述' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="父分类(可选)"
            name="parentId"
          >
            <Select
              placeholder="请选择父分类"
              allowClear
            >
              {categories.filter(c => c.parentId === null).map(category => ( // 仅显示顶级分类作为父分类选择项
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
