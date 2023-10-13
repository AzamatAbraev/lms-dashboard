import {
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
  Modal,
  Pagination,
  Space,
  Table,
} from "antd";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import request from "../../server";
import { LIMIT } from "../../constants";

import "./TeachersPage.css";

const TeachersPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const { Search } = Input;
  const [form] = Form.useForm();

  const getTeachers = useCallback(async () => {
    try {
      setLoading(true);
      let params = {
        page: activePage,
        limit: LIMIT,
        firstName: search,
      };
      let { data } = await request.get(`teachers`, { params });
      let { data: totalData } = await request.get(
        `teachers?firstName=${search}`
      );
      setTotal(totalData.length);
      data = data.map((el) => {
        el.key = el.id;
        return el;
      });
      setTeachers(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [activePage, search]);

  useEffect(() => {
    getTeachers();
  }, [getTeachers]);

  const showModal = () => {
    form.resetFields();
    setSelected(null);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      setWaiting(true);
      let values = await form.validateFields();
      if (selected === null) {
        await request.post("teachers", values);
      } else {
        await request.put(`teachers/${selected}`, values);
      }
      getTeachers();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err);
    } finally {
      setWaiting(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const editTeacher = async (id) => {
    try {
      setIsModalOpen(true);
      setSelected(id);
      let { data } = await request.get(`teachers/${id}`);
      form.setFieldsValue(data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteTeacher = (id) => {
    Modal.confirm({
      title: "Do you want to delete this teacher ?",
      onOk: async () => {
        await request.delete(`teachers/${id}`);
        getTeachers();
      },
    });
  };

  const onSearch = (value) => {
    setSearch(value);
  };

  const columns = [
    {
      title: "FirstName",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "LastName",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
      render: (data) => (
        <p className="salary-info">
          {data.toString().length >= 3 ? `$${data}` : `$${data}0`}
        </p>
      ),
    },
    {
      title: "Favourite Group",
      dataIndex: "favGroup",
      key: "favGroup",
      render: (data) => (
        <p className="fav-group">N{data === 0 ? "1" : `${data}`}</p>
      ),
    },
    {
      title: "Married",
      dataIndex: "isMarried",
      key: "isMarried",
      render: (data) => (data ? "Yes" : "No"),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (data) => (
        <Space size="middle">
          <Button onClick={() => editTeacher(data)} type="primary">
            Edit
          </Button>
          <Button onClick={() => deleteTeacher(data)} danger type="primary">
            Delete
          </Button>
          <Link to={`/teachers/${data}`} type="primary">
            See Students
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <Table
        scroll={{
          x: 1000,
        }}
        title={() => (
          <Fragment>
            <Flex align="center" justify="space-between">
              <h1>Teachers </h1>
              <Button
                onClick={showModal}
                className="modal-btn"
                type="primary"
                size="large"
              >
                Add teacher
              </Button>
            </Flex>
            <Search
              placeholder="Searching .."
              // enterButton="Search"
              onSearch={onSearch}
              onChange={(e) => setSearch(e.target.value)}
              size="large"
            />
            <p className="search-result">
              {total !== 0
                ? `Search results: ${total} teachers found`
                : "No teacher found"}
            </p>
          </Fragment>
        )}
        loading={loading}
        dataSource={teachers}
        columns={columns}
        pagination={false}
      />
      <Pagination
        onChange={(page) => setActivePage(page)}
        current={activePage}
        total={total}
      />
      <Modal
        title="Teacher Info"
        open={isModalOpen}
        confirmLoading={waiting}
        onOk={handleOk}
        okText={selected === null ? "Add teacher" : "Save teacher"}
        onCancel={closeModal}
        initialValues={{
          isMarried: false,
        }}
      >
        <Form
          form={form}
          className="modal-form"
          name="login"
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          autoComplete="off"
        >
          <Form.Item
            className="form-item"
            label="First Name"
            name="firstName"
            rules={[
              {
                required: true,
                message: "Please input your firstname!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            className="form-item"
            label="Last Name"
            name="lastName"
            rules={[
              {
                required: true,
                message: "Please input your lastname!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            className="form-item"
            label="Salary"
            name="salary"
            rules={[
              {
                required: true,
                message: "Please input your salary!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            className="form-item"
            label="Favourite Group"
            name="favGroup"
            rules={[
              {
                required: true,
                message: "Please fill!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            className="form-item"
            name="isMarried"
            valuePropName="checked"
            wrapperCol={{
              offset: 0,
              span: 16,
            }}
          >
            <Checkbox>Married ?</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default TeachersPage;
