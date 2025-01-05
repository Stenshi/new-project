import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Space,
  Popconfirm,
  Col,
  Row,
  AutoComplete,
  Cascader,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  CategoryAPI,
  CategoryCreateAPI,
  CategoryDeleteAPI,
  CategoryListAPI,
  CategoryUpdateAPI,
  SearchcategoryListAPI,
} from "../../../api/Category";

const CategoryManagement = () => {
  //获取分类列表包含子类
  const [categories, setCategories] = useState([]);
  //获取分类列表
  const [categoriesAll, setCategoriesAll] = useState([]);

  //获取初始的分类列表
  const [Kindlist, setKindlist] = useState([]);

  useEffect(() => {
    //请求分类列表
    const getCategory = async () => {
      const res = await CategoryListAPI();
      const Res = await CategoryAPI();
      setCategories(res.data);
      setKindlist(res.data);
      setCategoriesAll(Res.data);
    };
    getCategory();
  }, []);
  //usememo对数据进行二次处理
  //提取所有的name
  const kindname = useMemo(() => {
    const extractNames = (categories) => {
      return categories.reduce((names, category) => {
        // 提取当前分类的名称
        names.push(category.name);
        // 如果有子分类，递归提取子分类的名称
        if (category.children && category.children.length > 0) {
          names.push(...extractNames(category.children)); // 递归调用
        }
        return names;
      }, []);
    };
    return extractNames(Kindlist);
  }, [Kindlist]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  //父分类选择框
  const [parentOption, setparentoption] = useState([]);

  // 打开添加/编辑分类的 Modal
  const showModal = (category = null) => {
    setEditingCategory(category);
    form.resetFields();
    if (category) {
      // 转换函数
      const transformDataToOptions = (data) => {
        return data
          .map((item) => {
            //如果选择的父分类为它本身，则跳过
            if (item.id === category.id) {
              return null;
            }
            return {
              value: item.id,
              label: item.name,
              children: item.children
                ? transformDataToOptions(item.children)
                : [],
            };
          })
          .filter((item) => item !== null); // 过滤掉 null
      };
      const parentkind = transformDataToOptions(Kindlist);
      //设置父类lable选项
      const selectParent = category.parentId
        ? categoriesAll.find((c) => c.id === category.parentId)?.name
        : "无";
      setparentoption(parentkind);

      form.setFieldsValue({
        name: category.name,
        description: category.description,
        //传入value和lable
        parentId: [category.parentId, selectParent],
      });
    } else {
      // 转换函数
      const transformDataToOptions = (data) => {
        return data.map((item) => {
          return {
            value: item.id,
            label: item.name,
            children: item.children
              ? transformDataToOptions(item.children)
              : [],
          };
        });
      };
      const parentkind = transformDataToOptions(Kindlist);
      setparentoption(parentkind);

      form.setFieldsValue({
        name: "",
        description: "",
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
    form.validateFields();

    // 获取整个表单的值
    const values = form.getFieldsValue();

    if (editingCategory) {
      // 更新分类
      const value = {
        ...values,
        parentId: values.parentId
          ? values.parentId[values.parentId.length - 1]
          : null,
      };
      await CategoryUpdateAPI(editingCategory.id, value);
      const res = await CategoryListAPI();
      setCategories(res.data);
      setKindlist(res.data);
      message.success("分类更新成功");
    } else {
      // 添加分类
      const value = {
        ...values,
        parentId: values.parentId
          ? values.parentId[values.parentId.length - 1]
          : null,
      };
      await CategoryCreateAPI(value);
      const res = await CategoryListAPI();
      setCategories(res.data);
      setKindlist(res.data);
      const Res = await CategoryAPI();
      setCategoriesAll(Res.data);
      message.success("分类创建成功");
    }
    setIsModalVisible(false);
  };

  // 删除分类
  const handleDelete = async (id) => {
    await CategoryDeleteAPI(id);
    const res = await CategoryListAPI();
    setCategories(res.data);
    setKindlist(res.data);
    message.success("分类删除成功");
  };

  // 表格列定义
  const columns = [
    { title: "分类名称", dataIndex: "name", key: "name" },
    { title: "描述", dataIndex: "description", key: "description" },
    {
      title: "父分类",
      dataIndex: "parentId",
      key: "parentId",
      render: (parentId: number) =>
        parentId ? categoriesAll.find((c) => c.id === parentId)?.name : "无",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
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

  //子行展开和折叠
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  // 扁平化数据，以便表格渲染
  const flattenData = (data) => {
    let result = [];
    data.forEach((item) => {
      result.push(item);
      if (item.children && item.children.length > 0) {
        result = result.concat(flattenData(item.children)); // 递归展平子项
      }
    });
    return result;
  };

  const flattenedCategories = flattenData(categories);
  // 获取某一项的子项id列表
  const getChildrenKeys = (id) => {
    const getChildIds = (data, parentId) => {
      return data
        .filter((item) => item.parentId === parentId)
        .map((item) => item.id)
        .reduce((acc, currentId) => {
          acc.push(currentId);
          const children = getChildIds(data, currentId); // 递归获取子项
          acc = acc.concat(children);
          return acc;
        }, []);
    };
    return getChildIds(flattenedCategories, id);
  };

  // 处理展开/折叠行
  const onExpand = (expanded, record) => {
    let keys;
    if (expanded) {
      // 展开时，只加入父项的key，不展开子项
      keys = [...expandedRowKeys, record.id];
    } else {
      // 收回时，移除父项以及所有子项的key
      keys = expandedRowKeys.filter((key) => key !== record.id);
      const childrenKeys = getChildrenKeys(record.id);
      keys = keys.filter((key) => !childrenKeys.includes(key));
    }
    setExpandedRowKeys(keys);
  };

  console.log(categories);

  //搜索分类

  const [Searchoptions, SearchsetOptions] = useState([]);

  //匹配选项
  function OptionSearch(value: string): void {
    if (value) {
      // 根据输入的内容过滤匹配的类别
      const filteredCategories = kindname.filter((category) =>
        category.toLowerCase().includes(value.toLowerCase())
      );
      // 设置匹配结果
      SearchsetOptions(
        filteredCategories.map((category) => ({
          value: category,
        }))
      );
    } else {
      // 如果输入为空，清空选项
      SearchsetOptions([]);
    }
  }

  //点击选项
  function onselect(value: string) {
    setOpen(false);
    setSearchValue(value);
  }

  const [searchValue, setSearchValue] = useState("");

  //输入框内容变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpen(true);
    const value = e.target.value;
    setSearchValue(value);
    if (!value) {
      setExpandedRowKeys([]); //将所有展开的项折叠
      setCategories(Kindlist);
    }
  };

  //AutoComplete提示内容的显示
  const [open, setOpen] = useState(false);

  //点击搜索
  const handleSearch = async () => {
    setOpen(false);
    if (searchValue) {
      setExpandedRowKeys([]); //将所有展开的项折叠
      const res = await SearchcategoryListAPI(searchValue);
      setCategories(res.data);
    }
  };

  return (
    <div>
      <Row gutter={16}>
        {/* 按钮 */}
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            style={{ marginBottom: 20 }}
          >
            添加分类
          </Button>
        </Col>

        {/* 搜索框 */}
        <Col>
          {/* 使用AutoCOmplete自动补全,提升用户查询体验 */}
          <AutoComplete
            options={Searchoptions}
            onSearch={OptionSearch}
            size="large"
            open={open}
            onSelect={onselect}
          >
            <Input.Search
              placeholder="搜索商品"
              value={searchValue}
              onChange={handleSearchChange}
              onSearch={handleSearch}
              enterButton
              style={{ width: 300, marginBottom: 16 }} // 设置输入框宽度
            />
          </AutoComplete>
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={categories} // 渲染层级结构
        expandable={{
          expandedRowKeys, // 使用 expandable.expandedRowKeys 代替原来的 expandedRowKeys
          onExpand, // 展开/折叠事件
        }}
        pagination={false}
      />
      <Modal
        title={editingCategory ? "编辑分类" : "添加分类"}
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          name="categoryForm"
          initialValues={{ name: "", description: "", parentId: null }}
        >
          <Form.Item
            label="分类名称"
            name="name"
            rules={[{ required: true, message: "请输入分类名称" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: "请输入分类描述" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="父分类(可选)" name="parentId">
            <Cascader
              options={parentOption}
              changeOnSelect
              displayRender={(label) => label[label.length - 1]} // 只显示最后选择的分类（子分类）
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
