import { Button, DatePicker, Form, Input, Modal, Radio, Space, Table, Tag, Upload, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import { UpdateUser, UserListQuery, fetchUserToggleFreeze, fetchUserList, fetchUserUpdate } from "../request/user";
import { FilterValue, SorterResult, TablePaginationConfig } from "antd/es/table/interface";
import { SearchOutlined, RedoOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from "antd/es/upload";
import { Image } from "antd"
const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};


export default function user_manage() {
  const [messageApi, contextHolder] = message.useMessage();
  interface DataType {
    id: number;
    username: string;
    nickName: string;
    isFrozen: boolean;
    createTime: string;
    email: string,
    headPic: string,
    phoneNumber: string
  }

  const [query, setQuery] = useState<UserListQuery>({
    pageNo: 1,
    pageSize: 2,
    username: "",
    nickName: "",
    startTime: "",
    endTime: ""
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

  const freeze = (record: DataType) => {
    fetchUserToggleFreeze(+record.id).then((res: any) => {
      if (res.code === 200) {
        handleTableChange({
          current: query.pageNo,
        })
      }
    })
  }

  const columns: ColumnsType<DataType> = [
    {
      title: '序号',
      render: (_, record, index) => `${index + 1}`,
    },
    {
      title: '姓名',
      dataIndex: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phoneNumber',
    },
    {
      title: '头像',
      dataIndex: "headPic",
      render:(_:any,record)=>(
        <Image src={record.headPic} width={100} height={100} />
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (_, record) => (
        <span> {new Date(record.createTime).toLocaleDateString()}</span>
      )
    },
    {
      title: '是否冻结',
      dataIndex: 'isFrozen',
      render: (_, record) => (
        record.isFrozen ? <Tag color="red">冻结</Tag> : <Tag color="green">正常</Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button danger type="text" onClick={() => openDialog(record)}>修改</Button>
          <Button type="link" onClick={() => freeze(record)}>
            {record.isFrozen ? '解冻' : '冻结'}
          </Button>
        </Space>
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  let updateUserId = useRef(0);
  const openDialog = (record: DataType) => {
    updateUserId.current = record.id;
    setOpen(true);
    dialogForm.setFieldsValue({
      ...record
    })
    setImageUrl(record.headPic)
  }


  const datePickerChange = (_: any, formatString: [string, string]) => {
    setQuery({
      ...query,
      startTime: formatString[0],
      endTime: formatString[1]
    })
  }

  const onFormLayoutChange = ({ createTime, ...values }: any) => {
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

  const handleOk = () => {
    setConfirmLoading(true);
    let r = dialogForm.getFieldsValue();
    fetchUserUpdate({
      id: updateUserId.current,
      ...r,
      headPic:imageUrl
    }).then((res: any) => {
      console.log(res)
      if (res.code == 201) {
        handleTableChange({
          current: query.pageNo,
        })
      } else {
        message.error(res.data)
      }
    }).finally(() => {
      setConfirmLoading(false)
      setOpen(false)
    })
  }

  const [form] = Form.useForm();
  const [dialogForm] = Form.useForm();

const [imageUrl,setImageUrl] = useState<string>()

const [loading, setLoading] = useState(false);


const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
  if (info.file.status === 'uploading') {
    setLoading(true);
    return;
  }
  if (info.file.status === 'done') {
    if(info.file.response.code == 201){
      let path =  info.file.response.data.url
      setImageUrl(path)
    }
    setLoading(false);
  }
};

const uploadButton = (
  <div>
    {loading ? <LoadingOutlined /> : <PlusOutlined />}
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

  return <>
    {contextHolder}
    <Form
      initialValues={
        {
          username: "",
          nickName: "",
          createTime: "",
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

      <Form.Item label="创建时间" name="createTime">

        <DatePicker.RangePicker
          onChange={datePickerChange}
          format={'YYYY/MM/DD'}
        />
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
      title="用户信息"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={() => setOpen(false)}
    >
      <Form
        form={dialogForm}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >

        <Form.Item 
        name="headPic"
        valuePropName="file"
        label="头像" 
       >
          <Upload
            name="file"
            listType="picture-card"
            showUploadList={false}
            action="http://localhost:4396/upload/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item label="用户名" name="username">
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item label="昵称" name="nickName">
          <Input placeholder="请输入昵称" />
        </Form.Item>

        <Form.Item label="手机号" name="phoneNumber">
          <Input placeholder="请输入手机号" maxLength={11} />
        </Form.Item>

        <Form.Item label="邮箱" name="email">
          <Input placeholder="请输入邮箱" type="email" />
        </Form.Item>

        <Form.Item label="是否冻结" name="isFrozen">
          <Radio.Group>
            <Radio value={true}>冻结</Radio>
            <Radio value={false}>正常</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  </>
}