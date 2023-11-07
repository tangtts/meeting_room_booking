import { Button, Col, Flex, Form, Input, Row, message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadAvatar from '../../components/uploadAvatar';
import { UpdateSelfUser, fetchUserInfo, fetchUpdateSelf, UserInfo } from '../../request/user';
import { fetchSendEmail } from '../../request/email';



export function InfoModify() {
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish = (values: UpdateSelfUser) => {
    console.log("🚀 ~ file: InfoModify.tsx:26 ~ onFinish ~ values:", values);

    fetchUpdateSelf({
      ...values,
      headPic: userInfo.headPic,
    }).then((res: any) => {
      if (res.code == 201) {
        messageApi.success("修改成功")
        fetchUserInfo().then(res => {
          setUserInfo(res.data)
        })
      } else {
        messageApi.error(res.data)
      }
    })
  };

  const sendCaptcha = function () {
    fetchSendEmail(userInfo.email).then((res: any) => {
      if (res.code == 201) {
        messageApi.success(res.data)
      }
    })
  };

  const [userInfo, setUserInfo] = useState<UserInfo>({
    phoneNumber: '',
    username: '',
    headPic: "",
    nickName: "",
    email: ""
  });

  useEffect(() => {

    // 查询用户信息
    fetchUserInfo().then((res: any) => {
      if (res.code == 200) {
        setUserInfo({
          ...userInfo,
          ...res.data
        })
      }
      form.setFieldsValue({
        username: res.data.username,
        headPic: res.data.headPic,
        nickName: res.data.nickName,
        email: res.data.email,
        phoneNumber: res.data.phoneNumber,
        captcha: ""
      })
    })
  }, []);

  const successUpload = (headPic: string) => {
    setUserInfo({
      ...userInfo,
      headPic
    })
  }

  return <Row>
    {contextHolder}
    <Col span={18}>

      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        autoComplete="off"
      >
        <Form.Item
          label="头像"
          name="headPic"
        >
          <UploadAvatar image={userInfo.headPic} onSuccess={successUpload} />
        </Form.Item>

        <Form.Item
          label="昵称"
          name="nickName"
          rules={[
            { required: true, message: '请输入昵称!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="手机号"
          name="phoneNumber"
          rules={[
            { required: true, message: '请输入手机号!' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: '请输入邮箱!' },
            { type: "email", message: '请输入合法邮箱地址!' }
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="验证码"
          rules={[{ required: true, message: '请输入验证码!' }]}
        >
          <Row>
            <Col span={20}>
              <Form.Item name="captcha" noStyle>
                <Input />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={sendCaptcha}>发送验证码</Button>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item
          wrapperCol={{ span: 8, offset: 8 }}
        >
          <Row>
            <Col span={24}>
              <Button block size='large' type="primary" htmlType="submit">
                修改
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Col>
  </Row>
}

