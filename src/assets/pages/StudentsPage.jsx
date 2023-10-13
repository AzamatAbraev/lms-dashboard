import {
  Button,
  Checkbox,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
} from "antd";
import Search from "antd/es/input/Search";
import { Fragment, useCallback, useEffect, useState } from "react";

import "./StudentsPage.css";
import request from "../../server";

const StudentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [teachers, setTeachers] = useState();
  const [dataForId, setDataForId] = useState("");
  const [selected, setSelected] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [id, setId] = useState(null);
  const [form] = Form.useForm();


  const handleChange = (value) => {
    setSelected(value);
    setId(value);
  };

  const showModal = () => {
    form.resetFields();
    setSelected(null);
    setIsModalOpen(true);
  };

  const getFinalData = useCallback(async () => {
    try {
      let { data } = await request.get(
        `teachers/${id}/students?firstName=${search}`
      );
      setFinalData(data);
    } catch (err) {
      console.log(err);
    }
  }, [id, search]);

    const handleOk = async () => {
      try {
        setWaiting(true);
        let values = await form.validateFields();
        if (selected === null) {
          await request.post(`teachers/${id}/students`, values);
        } else {
          await request.put(`teachers/${id}/students/${selected}`, values);
        }
        getFinalData();
        setIsModalOpen(false);
      } catch (err) {
        console.log(err);
      } finally {
        setWaiting(false);
      }
    };

  useEffect(() => {
    const getTeachers = async () => {
      try {
        let { data } = await request.get(`teachers`);
        setTeachers(data);
        let { data: anotherData } = await request.get(
          `teachers?filter=${selected}`
        );
        setDataForId(anotherData);
      } catch (err) {
        console.log(err);
      }
    };

    getFinalData();

    getTeachers();
  }, [selected, id, getFinalData]);

  const editStudent = async (data) => {
    form.resetFields();
    try {
      setIsModalOpen(true);
      setSelected(id);
      let { data } = await request.get(`teachers/${id}/students/${data}`);
      form.setFieldsValue(data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteStudent = (data) => {
    Modal.confirm({
      title: "Do you want to delete this teacher ?",
      onOk: async () => {
        await request.delete(`teachers/${id}/students/${data}`);
        getFinalData();
      },
    });
  };

  let names = [];
  let ids = [];
  for (let i in teachers) {
    names.push(teachers[i].firstName);
    ids.push(teachers[i].id);
  }
  let options = names.map((name) => {
    return {
      label: name,
    };
  });
  options = ids.map((id) => {
    return {
      value: id,
    };
  });




  const closeModal = () => {
    setIsModalOpen(false);
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
      render: (data) => <p className="salary-info">{data}/100</p>,
    },
    {
      title: "Attendance",
      dataIndex: "attendance",
      key: "attendance",
      render: (data) => <p className="student-attendance">{data}%</p>,
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
      <Flex align="center" justify="space-between" gap={30}>
        <h1>Students</h1>
        <Search
          placeholder="Searching .."
          onChange={(e) => setSearch(e.target.value)}
          size="large"
        />
      </Flex>

      <Flex className="filter-box" align="center" justify="right" gap={20}>
        <Button
          onClick={showModal}
          className="modal-btn"
          type="primary"
          size="large"
        >
          Add student
        </Button>
        <Select
          defaultValue="Teachers ID"
          onChange={handleChange}
          options={options}
        />
      </Flex>
      <Table
        scroll={{
          x: 1000,
        }}
        title={() => <Fragment></Fragment>}
        loading={loading}
        dataSource={finalData}
        columns={columns}
        pagination={false}
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

export default StudentsPage;
