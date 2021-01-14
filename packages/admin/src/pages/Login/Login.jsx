import { Form, Input, Button, Checkbox } from 'antd';
import API from 'api';
import { useUser } from 'context/configureContext';
import { useState } from 'react';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

const Login = ({ history }) => {
  const [error, setError] = useState(null);
  const context = useUser();

  const onFinish = async (values) => {
    setError(null);
    try {
      const { data } = await API.post('/signin', values);
      context.dispatch({ type: 'UPDATE_USER', payload: { user: data?.data?.user } });
      localStorage.setItem('whatisthis-admin', data?.data?.accessToken);
      history.replace('/');
    } catch (err) {
      console.log(err);
      if (err.response) setError(err.response.data.message);
    }
  };

  return (
    <div className="flex flex-col">
      <span className="mb-6 text-lg font-semibold text-center">BrosCaro Admin Login</span>
      <Form {...layout} name="basic" initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password />
        </Form.Item>

        {error && <span className="my-3 font-semibold text-center text-red-500">{error}</span>}
        <Form.Item {...tailLayout}>
          <Button className="mt-3" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
