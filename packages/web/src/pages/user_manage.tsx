import { Button, Form, Input, Modal, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { UpdateUser, UserListQuery, fetchUserList, fetchUserUpdate } from "../request/user";
import { FilterValue, SorterResult, TablePaginationConfig } from "antd/es/table/interface";

import { SearchOutlined, RedoOutlined } from '@ant-design/icons'
export default function user_manage() {
  interface DataType {
    id: string;
    name: string;
    age: number;
    address: string;
  }

  const [query, setQuery] = useState<UserListQuery>({
    pageNo: 1,
    pageSize: 2,
    username: "",
    nickName: ""
  });

  const [dataSource, setDataSource] = useState<DataType[]>()
  const [dataTotal, setdataTotal] = useState<number>(0)

  const handleTableChange = (
    pagination: TablePaginationConfig,
  ) => {
    setQuery({
      ...query,
      pageNo: pagination.current || 1
    })
  };

  useEffect(() => {
    fetchUserList(query).then((res: any) => {
      if (res.code === 200) {
        setDataSource(res.data.users)
        setdataTotal(res.data.totalCount)
      }
    })
  }, [query])

  const columns: ColumnsType<DataType> = [
    {
      title: '姓名',
      dataIndex: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button danger type="text" onClick={() => openDialog(record)}>修改</Button>
        </Space>
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  const openDialog = (record: DataType) => {
    setOpen(true);
    setDialogInitValue({
      ...dialogInitValue,
      ...record
    })
    console.log("🚀 ~ file: user_manage.tsx:65 ~ openDialog ~ record:", record);
  }

  const onFormLayoutChange = (values: any) => {
    console.log(values)
    setQuery({
      ...query,
      ...values
    })
  }

  const onReset = () => {
    form.resetFields();
    let fieldsValue = form.getFieldsValue();
    setQuery({
      pageNo: 1,
      pageSize: 2,
      ...fieldsValue
    })
  };
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [dialogInitValue, setDialogInitValue] = useState<UpdateUser>({
    id: '',
    username: "",
    nickName: "",
    email: "",
    phoneNumber: ""
  })
  const handleOk = () => {
    setConfirmLoading(true);
    let r = dialogForm.getFieldsValue();
    fetchUserUpdate(r).then((res: any) => {
      console.log(res)
    })

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  }

  const [form] = Form.useForm();
  const [dialogForm] = Form.useForm();



  return <>
    <Form
      initialValues={
        {
          username: "",
          nickName: ""
        }
      }
      layout="inline"
      form={form}
      onFinish={onFormLayoutChange}
    >

      <Form.Item label="用户名" name="username">
        <Input placeholder="请输入用户名" />
      </Form.Item>

      <Form.Item label="昵称" name="nickName">
        <Input placeholder="请输入昵称" />
      </Form.Item>

      <Form.Item>
        <Space wrap>
          <Button type="primary" htmlType="submit"
            icon={<SearchOutlined />}
          >查询</Button>
          <Button type="primary"
            onClick={onReset}
            icon={<RedoOutlined />}
          >重置</Button>
        </Space>
      </Form.Item>
    </Form>

    <Table
      rowKey={(record) => record.id}
      pagination={{
        current: query.pageNo,
        pageSize: query.pageSize,
        total: dataTotal
      }}
      onChange={handleTableChange}
      dataSource={dataSource} columns={columns} />

    <Modal
      title="Title"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={() => setOpen(false)}
    >
      <Form
        initialValues={dialogInitValue}
        layout="inline"
        form={dialogForm}
      >

        <Form.Item label="用户名" name="username">
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item label="昵称" name="nickName">
          <Input placeholder="请输入昵称" />
        </Form.Item>
      </Form>
    </Modal>
  </>
}