import { useState } from "react";
import { Table, Button, Input, Space, DatePicker, ConfigProvider } from "antd";
// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
// 确保还导入相关的 dayjs 文件，否则所有文本的区域设置都不会更改（例如范围选择器月份）
import locale from "antd/locale/zh_CN";
import dayjs from "dayjs";

import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");
// 模拟的操作日志数据
const mockData = [
  {
    key: "1",
    action: "添加商品",
    user: "张三",
    time: "2025-01-01 12:00",
    details: "商品“苹果”添加成功",
  },
  {
    key: "2",
    action: "修改商品",
    user: "李四",
    time: "2025-01-02 14:30",
    details: "商品“香蕉”价格更新为10元",
  },
  {
    key: "3",
    action: "删除商品",
    user: "王五",
    time: "2025-01-03 16:45",
    details: "商品“橙子”被删除",
  },
  // 可以继续添加更多数据
];

const { RangePicker } = DatePicker;

const OperationLog = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(mockData);

  // 过滤功能
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = mockData.filter(
      (item) =>
        item.action.includes(value) ||
        item.user.includes(value) ||
        item.details.includes(value)
    );
    setFilteredData(filtered);
  };

  // 清空搜索
  const handleReset = () => {
    setSearchText("");
    setFilteredData(mockData);
  };

  // 时间筛选功能
  const handleDateChange = (dates) => {
    if (dates) {
      const [startDate, endDate] = dates;
      const filtered = mockData.filter((item) => {
        const logDate = new Date(item.time);
        return logDate >= startDate && logDate <= endDate;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(mockData);
    }
  };

  const columns = [
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "管理员",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "时间",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "详情",
      dataIndex: "details",
      key: "details",
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="输入管理员姓名"
          allowClear
          enterButton
          style={{ width: 250 }}
        />
        {/* 日期选择器 */}
        {/* 设置语言为中文 */}
        <ConfigProvider locale={locale}>
          <RangePicker
            onChange={handleDateChange}
            style={{ width: 300 }}
            defaultOpenValue={dayjs("2015-01-01", "YYYY-MM-DD")}
          />
        </ConfigProvider>
        
      </Space>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />
    </div>
  );
};

export default OperationLog;
