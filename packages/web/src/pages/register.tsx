


import { Button, message, Form, Input, Row, Col, Image, Flex } from 'antd';
import { useEffect, useState } from 'react';
import { RegisterParams, login, register } from '../request/user';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate()

  const onFinish = (values: RegisterParams) => {
    register(values).then((res: any) => {
      if (res.code == 201) {
        messageApi.success('注册成功!');
        navigate('/')
      } else {
        messageApi.error(res.data);
      }
      console.log(res)
    })
  };

  const [captcha, setCaptcha] = useState<string>('')

  useEffect(() => {
    generateCaptcha()
  }, [])

const generateCaptcha = ()=>{
  fetch("http://localhost:4396/user/generateCaptcha"

  ).then(res => res.json()).then(r => {
    setCaptcha(r.data)
  })
}


  const createAccount = () => {
    navigator
  }
  const forgotPassword = () => { }

  const regenerate = ()=>{
    generateCaptcha()
  }
  return (
    <>
    <Flex justify='center' align='center' vertical>
      {contextHolder}
      <h1>abc</h1>
      <Form
        name="basic"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18}}
        style={{ maxWidth: 600 }}
        initialValues={{
          username: 'lisi',
          password: '333333',
          nickName:"lisi",
          email:"123@qq.com",
          phoneNumber: '12345678901',

        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<RegisterParams>
          label="用户名"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<RegisterParams>
          label="昵称"
          name="nickName"
          rules={[{ required: true, message: 'Please input your nickName!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<RegisterParams>
          label="密码"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<RegisterParams & { repeatPassword: string }>
          label="确认密码"
          name="repeatPassword"
          rules={[{ required: true, message: 'Please input your password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('确认密码与密码不匹配!'));
            },
          }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<RegisterParams>
          label="邮箱"
          name="email"
        >
          <Input />
        </Form.Item>

        <Form.Item<RegisterParams>
          label="手机号"
          name="phoneNumber"
        >
          <Input />
        </Form.Item>

        <Form.Item<RegisterParams>
          label="验证码"
        >
          <Row gutter={8}>
            <Col span={18}>
              <Form.Item<RegisterParams>
                name="captcha"
                noStyle
                rules={[{ required: true, message: 'Please input the captcha you got!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
                <img onClick={regenerate} src={`data:image/svg+xml;utf8,${encodeURIComponent(captcha)}`}></img>
            </Col>
          </Row>
        </Form.Item>


        <Form.Item
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
        >
          <Flex justify='space-around'>
            <Button type='link'>
              <Link to="register">
                创建账号
              </Link>
            </Button>
            <Button type='link'>
              忘记密码
              {/* <Link to="forgotpassword">
              </Link> */}
            </Button>
          </Flex>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      </Flex>
    </>
  )
}