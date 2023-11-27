import { Button, DatePicker, Flex, Form, Input, Modal, Popconfirm, Radio, Select, Space, Table, Tag, TimePicker, Upload, message } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import { MeetingRoomSearchResult, fetchCreateMeetingRoom, fetchDelMeetingRoom, fetchUpdateMeetingRoom, meetingListQuery, meetingUpdate } from "../../request/meeting";

import { fetchBooingList, fetchUpdateBooingStatus } from "../../request/Booking"

import { TablePaginationConfig } from "antd/es/table/interface";
import { SearchOutlined, RedoOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import TextArea from "antd/es/input/TextArea";
import { UserInfo } from "../../request/user";


export interface SearchBooking {
  username: string;
  meetingRoomName: string;
  meetingRoomPosition: string;
  rangeStartDate: Date;
  rangeStartTime: Date;
  rangeEndDate: Date;
  rangeEndTime: Date;
}

interface BookingSearchResult {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  note: string;
  createTime: string;
  updateTime: string;
  user: UserInfo,
  room: MeetingRoomSearchResult
}

export function BookingManage() {
  const [messageApi, contextHolder] = message.useMessage();
  interface DataType {
    id: number;
    startTime: string,
    endTime: string

    status: string;

    note: string;
    createTime: string,
  }

  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(2);
  const [num, setNum] = useState<number>(0);



  const searchBooking = async (values: SearchBooking) => {
    fetchBooingList({
      ...values,
      pageNo: pageNo,
      pageSize: pageSize
    }).then((res: any) => {
      if (res.code === 200) {
        setDataSource(res.data.bookings)
        setDataTotal(res.data.totalCount)
      }
    })
  }
  useEffect(() => {
    searchBooking({
      username: form.getFieldValue('username'),
      meetingRoomName: form.getFieldValue('meetingRoomName'),
      meetingRoomPosition: form.getFieldValue('meetingRoomPosition'),
      rangeStartDate: form.getFieldValue('rangeStartDate'),
      rangeStartTime: form.getFieldValue('rangeStartTime'),
      rangeEndDate: form.getFieldValue('rangeEndDate'),
      rangeEndTime: form.getFieldValue('rangeEndTime')
    });
  }, [pageNo, pageSize, num]);

  const [dataSource, setDataSource] = useState<BookingSearchResult[]>()

  const [dataTotal, setDataTotal] = useState<number>(0)

  const handleTableChange = (
    pageNo: number, pageSize: number,
  ) => {
    setPageNo(pageNo)
    setPageSize(pageSize)
  };

  const changeStatus = async (id: number, status: '1' | '2' | '3') => {
    fetchUpdateBooingStatus(id, status).then((res: any) => {
      if (res.code === 201 || res.code === 200) {
        message.success('状态更新成功');
        setNum(Math.random());
      } else {
        message.error(res.data.data);
      }
    })
  }

  const columns: ColumnsType<BookingSearchResult> = [
    {
      title: '序号',
      render: (_, record, index) => `${index + 1}`,
    },
    {
      title: '会议室名称',
      dataIndex: 'room',
      render(_, record) {
        return record.room.name
      }
    },
    {
      title: '会议室位置',
      dataIndex: 'room',
      render(_, record) {
        return record.room.location
      }
    },
    {
      title: '预定人',
      dataIndex: 'user',
      render(_, record) {
        return record.user.username
      }
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: (_, record) => (
        <span> {new Date(record.startTime).toLocaleDateString()}</span>
      )
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: (_, record) => (
        <span> {new Date(record.endTime).toLocaleDateString()}</span>
      )
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (_, record) => {
        let map = new Map([
          ["0",["进行中","cyan"]],
          ["1", ["通过","success"]],
          ["2", ["拒绝","error"]],
          ["3", ["解绑","orange"]],
        ]);
        let r = map.get(record.status+'')!
        return  <Tag  color={r[1]}>{r[0]}</Tag>
      }
    },

    {
      title: '预定时间',
      dataIndex: 'createTime',
      render: (_, record) => (
        <span> {new Date(record.createTime).toLocaleDateString()}</span>
      )
    },
    {
      title: '备注',
      dataIndex: 'note'
    },
    {
      title: '描述',
      dataIndex: 'description'
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="通过申请"
            description="确认通过吗？"
            onConfirm={() => changeStatus(record.id, '1')}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link">通过</Button>
          </Popconfirm>

          <Popconfirm
            title="驳回申请"
            description="确认驳回吗？"
            onConfirm={() => changeStatus(record.id, '2')}
            okText="Yes"
            cancelText="No"
          >
            <Button danger type="link">驳回</Button>
          </Popconfirm>

          <Popconfirm
            title="解除申请"
            description="确认解除吗?"
            onConfirm={() => changeStatus(record.id, '3')}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link">解除</Button>
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


  const onReset = () => {
    form.resetFields();
    setNum(Math.random())
  };
  const [confirmLoading, setConfirmLoading] = useState(false);



  const [form] = Form.useForm();
  const [dialogForm] = Form.useForm();



  return <>
    {contextHolder}
    <Form
      layout="inline"
      form={form}
      size="large"
      onFinish={searchBooking}
    >
      <Flex wrap="wrap" gap="small">

        <Form.Item label="预定人" name="username">
          <Input />
        </Form.Item>

        <Form.Item label="会议室名称" name="meetingRoomName">
          <Input />
        </Form.Item>

        <Form.Item label="预定状态" name="status">
          <Select
            style={{ width: 120 }}
            defaultValue=""
            // 申请中、审批通过、审批驳回、已解除
            options={[
              { value: '', label: '全部' },
              { value: '0', label: '申请中' },
              { value: '1', label: '审批通过' },
              { value: '2', label: '审批驳回' },
              { value: '3', label: '已解除' },
            ]}
          />
        </Form.Item>

        <Form.Item label="预定开始日期" name="rangeStartDate">
          <DatePicker />
        </Form.Item>

        <Form.Item label="预定开始时间" name="rangeStartTime">
          <TimePicker />
        </Form.Item>

        <Form.Item label="预定结束日期" name="rangeEndDate">
          <DatePicker />
        </Form.Item>

        <Form.Item label="预定结束时间" name="rangeEndTime">
          <TimePicker />
        </Form.Item>

        <Form.Item label="位置" name="meetingRoomPosition">
          <Input />
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
      </Flex>
    </Form>

    <Table
      rowKey={(record) => record.id}
      pagination={{
        current: pageNo,
        pageSize: pageSize,
        total: dataTotal,
        onChange: handleTableChange
      }}
      dataSource={dataSource} columns={columns} />

    <Modal
      title="会议室信息"
      open={open}
      // onOk={handleOk}
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
