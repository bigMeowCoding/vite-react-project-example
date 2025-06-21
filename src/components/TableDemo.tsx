import { Table, Input, Select, Button, Form, Space } from 'antd'
import React, { useState } from 'react'

const { Option } = Select

interface DataItem {
  key: React.Key
  name: string
  age: number
  gender: string
  address: string
}

const App: React.FC = () => {
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState<DataItem[]>([
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      gender: 'male',
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      gender: 'male',
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      gender: 'female',
      address: 'Sidney No. 1 Lake Park',
    },
  ])
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: DataItem) => (
        <Form.Item
          name={['user', record.key, 'name']}
          initialValue={record.name}
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
      render: (_: any, record: DataItem) => (
        <Form.Item
          name={['user', record.key, 'age']}
          initialValue={record.age}
          rules={[{ required: true, message: '请输入年龄' }]}
        >
          <Input type="number" />
        </Form.Item>
      ),
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (_: any, record: DataItem) => (
        <Form.Item
          name={['user', record.key, 'gender']}
          initialValue={record.gender}
          rules={[{ required: true, message: '请选择性别' }]}
        >
          <Select>
            <Option value="male">男</Option>
            <Option value="female">女</Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      render: (_: any, record: DataItem) => (
        <Form.Item
          name={['user', record.key, 'address']}
          initialValue={record.address}
          rules={[{ required: true, message: '请输入地址' }]}
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: DataItem) => (
        <Space size="middle">
          <Button type="link" danger onClick={() => handleDelete(record.key)}>
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const handleDelete = (key: React.Key) => {
    setDataSource((prev) => prev.filter((item) => item.key !== key))
  }

  const handleAdd = () => {
    const newKey = Date.now().toString()
    setDataSource((prev) => [
      ...prev,
      {
        key: newKey,
        name: '',
        age: 0,
        gender: 'male',
        address: '',
      },
    ])
  }

  const onFinish = (values: any) => {
    console.log('提交数据:', values)
    // 这里可以处理提交逻辑
  }

  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
      <Form
        form={form}
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          components={{
            body: {
              // 禁用行选择功能
              row: (props) => <tbody {...props} />,
            },
          }}
        />
        <Form.Item style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleAdd}>
            添加行
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default App
