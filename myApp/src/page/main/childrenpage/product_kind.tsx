
import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';

const ProductKind = () => {
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // 表格列配置
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '操作', key: 'action', render: (text, record) => (
      <>
        <Button onClick={() => handleEditCategory(record)} style={{ marginRight: 8 }}>编辑</Button>
        <Button onClick={() => handleDeleteCategory(record.id)} danger>删除</Button>
      </>
    )}
  ];

  // 添加分类
  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsModalVisible(true);
  };

  // 编辑分类
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setIsModalVisible(true);
  };

  // 删除分类
  const handleDeleteCategory = (id) => {
    setCategories(categories.filter(category => category.id !== id));
    message.success('分类删除成功');
  };

  // 提交表单
  const handleOk = (values) => {
    if (editingCategory) {
      // 更新分类
      setCategories(categories.map(category => category.id === values.id ? values : category));
      message.success('分类更新成功');
    } else {
      // 添加分类
      setCategories([...categories, { ...values, id: Date.now() }]);
      message.success('分类添加成功');
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={handleAddCategory} style={{ marginBottom: 16 }}>
        添加分类
      </Button>
      <Table
        dataSource={categories}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
      <Modal
        title={editingCategory ? '编辑分类' : '添加分类'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          initialValues={editingCategory || {}}
          onFinish={handleOk}
        >
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductKind;