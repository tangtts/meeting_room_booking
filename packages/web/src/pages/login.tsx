
import { Button, message, Form, Input, Row, Col, Image, Flex } from 'antd';
import { useEffect, useState } from 'react';
import { LoginParams, login } from '../request/user';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate()

  const onFinish = (values: LoginParams) => {
    login(values).then((res: any) => {
      if (res.code == 201) {
        localStorage.setItem('accessToken', res.data.accessToken)
        localStorage.setItem('refreshToken', res.data.refreshToken)
        localStorage.setItem('user_info', JSON.stringify(res.data.userInfo));
        messageApi.success('登录成功!');
        navigate('/user_manage')
      } else {
        messageApi.error(res.data);
      }
    })
  };

  const [captcha, setCaptcha] = useState<string>('')

  useEffect(() => {
    fetch("http://localhost:4396/user/generateCaptcha"

    ).then(res => res.json()).then(r => {
      setCaptcha(r.data)
    })
  }, [])

 
  const forgotPassword = () => { }

  return (
    <>
      {contextHolder}
      <Row  style={{height:'100vh',textAlign:'center'}}>
      <Col span={24}><h1>登录</h1></Col>  
      <Col span={24}  offset={6}>
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        style={{ maxWidth: 600 }}
        initialValues={{
          username: 'lisi',
          password: '333333',
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<LoginParams>
          label="用户名"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<LoginParams>
          label="密码"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
        >
          <Flex justify='space-around'>
            <Button type='link'>
              <Link to="/register">
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

        {/* 
        <Form.Item<LoginParams>
          label="验证码"
        >
          <Row gutter={8}>
            <Col span={18}>
              <Form.Item<LoginParams>
                name="captcha"
                noStyle
                rules={[{ required: true, message: 'Please input the captcha you got!' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Button>
                <Image src={`data:image/svg+xml;utf8,${encodeURIComponent(captcha)}`}></Image>
              </Button>
            </Col>
          </Row>
        </Form.Item> */}

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      </Col>
      </Row>
    </>
  )
}