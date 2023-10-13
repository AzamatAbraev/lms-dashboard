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
import { useParams } from "react-router-dom";

import request from "../../server";
import { LIMIT } from "../../constants";

import "./TeachersPage.css";

const StudentsByTeacher = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [name, setName] = useState([]);

  const { Search } = Input;
  const [form] = Form.useForm();
  const {teachersId} = useParams();




  const getStudents = useCallback(async () => {
    try {
      setLoading(true);
      let params = {
        page: activePage,
        limit: LIMIT,
        firstName: search,
      };
      let { data } = await request.get(`teachers/${teachersId}/students`, {
        params,
      });
      let {data: teacherName} = await request.get(`teachers/${teachersId}`);
      setName(teacherName);
      let { data: totalData } = await request.get(
        `teachers/${teachersId}/students?firstName=${search}`
      );
      setTotal(totalData.length);
      data = data.map((el) => {
        el.key = el.id;
        return el;
      });
      setStudents(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [activePage, search, teachersId]);

  useEffect(() => {
    getStudents();
  }, [getStudents]);

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
        await request.post(`teachers/${teachersId}/students`, values);
      } else {
        console.log(selected);
        await request.put(`teachers/${teachersId}/students/${selected}`, values);
      }
      getStudents();
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

  const editStudent = async (id) => {
    try {
      setIsModalOpen(true);
      setSelected(id);
      let { data } = await request.get(`teachers/${teachersId}/students/${id}`);
      form.setFieldsValue(data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteStudent = (id) => {
    console.log(id);
    Modal.confirm({
      title: "Do you want to delete this teacher ?",
      onOk: async () => {
        await request.delete(`teachers/${teachersId}/students/${id}`);
        getStudents();
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
      title: "Mark",
      dataIndex: "mark",
      key: "mark",
      render: (data) => (
        <p className="salary-info">
          {data}/100
        </p>
      ),
    },
    {
      title: "Attendance",
      dataIndex: "attendance",
      key: "attendance",
      render: (data) => <p className="student-attendance">{data}%</p>
    },
    {
      title: "Works ?",
      dataIndex: "isWork",
      key: "isWork",
      render: (data) => (data ? "Yes" : "No"),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (data) => (
        <Space size="middle">
          <Button onClick={() => editStudent(data)} type="primary">
            Edit
          </Button>
          <Button onClick={() => deleteStudent(data)} danger type="primary">
            Delete
          </Button>
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
              <h1>Students of {name.firstName} {name.lastName} </h1>
              <Button
                onClick={showModal}
                className="modal-btn"
                type="primary"
                size="large"
              >
                Add student
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
                ? `About ${total} students found`
                : "No student found"}
            </p>
          </Fragment>
        )}
        loading={loading}
        dataSource={students}
        columns={columns}
        pagination={false}
      />
      <Pagination
        onChange={(page) => setActivePage(page)}
        current={activePage}
        total={total}
      />
      <Modal
        title="Student Info"
        open={isModalOpen}
        confirmLoading={waiting}
        onOk={handleOk}
        okText={selected === null ? "Add student" : "Save student"}
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
            label="Mark"
            name="mark"
            rules={[
              {
                required: true,
                message: "Please input your mark!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            className="form-item"
            label="Attendance"
            name="attendance"
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
            name="isWork"
            valuePropName="checked"
            wrapperCol={{
              offset: 0,
              span: 16,
            }}
          >
            <Checkbox>Works ?</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default StudentsByTeacher;
