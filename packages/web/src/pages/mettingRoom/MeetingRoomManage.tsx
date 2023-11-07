import { Button, DatePicker, Form, Input, Modal, Popconfirm, Radio, Space, Table, Tag, Upload, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import { fetchCreateMeetingRoom, fetchDelMeetingRoom, fetchMeetingList, fetchUpdateMeetingRoom, meetingListQuery, meetingUpdate } from "../../request/meeting";
import { FilterValue, SorterResult, TablePaginationConfig } from "antd/es/table/interface";
import { SearchOutlined, RedoOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from "antd/es/upload";
import { Image } from "antd"
import UploadAvatar from "../../components/uploadAvatar";
import TextArea from "antd/es/input/TextArea";



export function MeetingRoomManage() {
  const [messageApi, contextHolder] = message.useMessage();
  interface DataType {
    id: number;
    name: string;
    capacity: number;
    location: string;
    equipment: string;
    description: string,
    isBooked: boolean,
    createTime: string,
  }

  const [query, setQuery] = useState<meetingListQuery>({
    pageNo: 1,
    pageSize: 2,
    name: "",
    equipment: "",
    capacity: "",
  });

  const [dataSource, setDataSource] = useState<DataType[]>()

  const [dataTotal, setdataTotal] = useState<number>(0)

  const handleTableChange = (
    pagination: TablePaginationConfig = {},
  ) => {
    setQuery({
      ...query,
      pageNo: pagination.current || 1
    })
  };

  useEffect(() => {
    fetchMeetingList(query).then((res: any) => {
      if (res.code === 200) {
        setDataSource(res.data.meetingRooms)
        setdataTotal(res.data.totalCount)
      }
    })
  }, [query])

  const columns: ColumnsType<DataType> = [
    {
      title: '序号',
      render: (_, record, index) => `${index + 1}`,
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '是否预定',
      dataIndex: 'isBooked',
      render: (_, record) => {
        return record.isBooked ? <Tag color="red">预定</Tag> : <Tag color="green">未预定</Tag>
      }
    },
    {
      title: '容量',
      dataIndex: 'capacity',
    },
    {
      title: '位置',
      dataIndex: 'location',
    },
    {
      title: '装备',
      dataIndex: 'equipment',
    },
    {
      title: '会议描述',
      dataIndex: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (_, record) => (
        <span> {new Date(record.createTime).toLocaleDateString()}</span>
      )
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button danger type="text" onClick={() => openDialog(record)}>修改</Button>

          <Popconfirm
            title="删除会议室"
            description="确定要删除会议室吗"
            onConfirm={() => confirmDelete(record)}
            onCancel={() => { }}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="text">删除</Button>
          </Popconfirm>

        </Space>
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const id = useRef(0)
  const openDialog = (record: DataType) => {
    setOpen(true);
    id.current = record.id;
    dialogForm.setFieldsValue(record)
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


  const updateMeetingRoom = (form: meetingUpdate) => {
    fetchUpdateMeetingRoom({
      ...form,
    }).then((res: any) => {
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

  const addMeetingRoom = (form: Omit<meetingUpdate, 'id'>) => {
    fetchCreateMeetingRoom(form).then((res: any) => {
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


  const handleOk = () => {
    setConfirmLoading(true);
    let r = dialogForm.getFieldsValue();
    if (id.current) {
      updateMeetingRoom({
        ...r,
        id: id.current
      })
    } else {
      addMeetingRoom(r)
    }
  }

  const [form] = Form.useForm();
  const [dialogForm] = Form.useForm();

  const addOneMeetingRoom = () => {
    setOpen(true);
    id.current = 0
    dialogForm.resetFields();
  }

  const confirmDelete = (record: meetingUpdate) => {
    fetchDelMeetingRoom(record.id).then((res:any)=>{
        if(res.code == 200){
          messageApi.success("删除成功!")
          handleTableChange()
        }else {
          messageApi.success(res.data)
        }
    })
  }

  return <>
    {contextHolder}
    <Form
      layout="inline"
      form={form}
      onFinish={onFormLayoutChange}
    >

      <Form.Item label="名称" name="name">
        <Input placeholder="请输入会议名称" />
      </Form.Item>

      <Form.Item label="容量" name="capacity">
        <Input placeholder="请输入容量" type="number" />
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

          <Button
            onClick={addOneMeetingRoom}
            icon={<PlusOutlined />}
          >新增</Button>

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
      title="会议室信息"
      open={open}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={() => setOpen(false)}
    >
      <Form
        initialValues={{
          isBooked: true,
          name: "",
          capacity: 10,
          location: "",
          equipment: "",
          description: "",
        }}
        form={dialogForm}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >

        <Form.Item label="会议室名称" name="name">
          <Input placeholder="请输入会议室名称" />
        </Form.Item>

        <Form.Item label="容量" name="capacity" rules={[
          { type: 'number', max: 100, min: 1, message: '请输入1-100之间的数字' }
        ]}>
          <Input placeholder="请输入容量" type="number" min={1} max={100} />
        </Form.Item>

        <Form.Item label="位置" name="location">
          <Input placeholder="请输入位置" />
        </Form.Item>

        <Form.Item label="装备" name="equipment">
          <Input placeholder="请输入装备" />
        </Form.Item>

        <Form.Item label="会议描述" name="description">
          <TextArea rows={4} placeholder="请输入会议描述" />
        </Form.Item>

        <Form.Item label="是否预定" name="isBooked">
          <Radio.Group>
            <Radio value={true}>预定</Radio>
            <Radio value={false}>未预定</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  </>
}