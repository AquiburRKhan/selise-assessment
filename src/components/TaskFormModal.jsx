/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Modal, Form, Input, Radio, DatePicker, Select, Button } from "antd";

const dateFormat = "DD/MM/YYYY";

const TaskFormModal = ({
  showAddTaskModal,
  toggleAddTaskModal,
  onTaskAdd,
  onTaskEdit,
  selectedTask,
}) => {
  const [form] = Form.useForm();
  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    form.setFieldsValue({
      title: selectedTask.title,
      description: selectedTask.description,
      priority: selectedTask.priority,
      startDate: selectedTask.startDate
        ? dayjs(selectedTask.startDate, dateFormat)
        : null,
      endDate: selectedTask.endDate
        ? dayjs(selectedTask.endDate, dateFormat)
        : null,
      status: selectedTask.status,
      assignedTo: selectedTask.assignedTo,
      subTasks: selectedTask.subTasks,
    });

    setAttachments(selectedTask.attachments);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const formItemLayoutWithOutLabel = {
    wrapperCol: { span: 16, offset: 8 },
  };

  const addTask = (values) => {
    const startDate = values.startDate.format(dateFormat);
    const endDate = values.endDate.format(dateFormat);

    const transformedAttachments = attachments
      ? attachments.map((attachment) => {
          return {
            name: attachment.name,
            url: URL.createObjectURL(attachment),
          };
        })
      : [];
    const task = {
      id: `${Date.now()}`,
      title: values.title,
      description: values.description,
      priority: values.priority,
      startDate: startDate,
      endDate: endDate,
      status: values.status,
      assignedTo: values.assignedTo,
      subTasks: values.subTasks,
      attachments: transformedAttachments,
    };

    onTaskAdd(task);
  };

  const editTask = (values) => {
    const startDate = values.startDate.format(dateFormat);
    const endDate = values.endDate.format(dateFormat);
    const task = {
      id: selectedTask.id,
      title: values.title,
      description: values.description,
      priority: values.priority,
      startDate: startDate,
      endDate: endDate,
      status: values.status,
      assignedTo: values.assignedTo,
      subTasks: values.subTasks,
      attachments: attachments.map((attachment) => {
        return {
          name: attachment.name,
          url: URL.createObjectURL(attachment),
        };
      }),
    };

    onTaskEdit(task);
  };

  const handleAttachments = (e) => {
    const files = e.target.files;
    const filesArr = Object.values(files);
    setAttachments(filesArr);
  };

  return (
    <Modal
      title={selectedTask.id ? "Edit Task" : "Add Task"}
      open={showAddTaskModal}
      onCancel={toggleAddTaskModal}
      okText={selectedTask.id ? "Edit" : "Add"}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        onFinish={selectedTask.id ? editTask : addTask}
        requiredMark={false}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: "Title is required",
            },
            {
              max: 100,
              message: "Title must be less than 100 characters",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Description is required",
            },
            {
              max: 150,
              message: "Description must be less than 150 characters",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Priority"
          name="priority"
          rules={[
            {
              required: true,
              message: "Priority is required",
            },
          ]}
        >
          <Radio.Group>
            <Radio value="low"> Low </Radio>
            <Radio value="medium"> Medium </Radio>
            <Radio value="high"> High </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[
            {
              required: true,
              message: "Start Date is required",
            },
          ]}
        >
          <DatePicker format={dateFormat} />
        </Form.Item>
        <Form.Item
          label="End Date"
          name="endDate"
          rules={[
            {
              required: true,
              message: "End Date is required",
            },
          ]}
        >
          <DatePicker format={dateFormat} />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Status is required" }]}
        >
          <Select placeholder="Select status">
            <Select.Option value="todo">To-do</Select.Option>
            <Select.Option value="inProgress">In progress</Select.Option>
            <Select.Option value="done">Done</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="assignedTo"
          label="Assigned Person"
          rules={[{ required: true, message: "Assigned Person is required" }]}
        >
          <Select placeholder="Select person">
            <Select.Option value="person1">Person 1</Select.Option>
            <Select.Option value="person2">Person 2</Select.Option>
            <Select.Option value="person3">Person 3</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Attachment">
          <Input type="file" multiple onChange={handleAttachments} />
          {attachments && attachments.length > 0 && (
            <ul>
              {attachments.map((attachment) => (
                <li key={attachment.name}>{attachment.name}</li>
              ))}
            </ul>
          )}
        </Form.Item>
        <Form.List name="subTasks">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  {...(index === 0
                    ? formItemLayout
                    : formItemLayoutWithOutLabel)}
                  label={index === 0 ? "Sub tasks" : ""}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    name={[field.name, "title"]}
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "Please sub task title or delete this row.",
                      },
                    ]}
                    noStyle
                  >
                    <Input
                      placeholder="subtask title"
                      style={{ width: "80%", marginBottom: "8px" }}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "description"]}
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message:
                          "Please sub task description or delete this row.",
                      },
                    ]}
                    noStyle
                  >
                    <Input
                      placeholder="subtask description"
                      style={{ width: "80%" }}
                    />
                  </Form.Item>
                  <MinusCircleOutlined
                    style={{ margin: "0 8px" }}
                    className="dynamic-delete-button"
                    onClick={() => remove(field.name)}
                  />
                </Form.Item>
              ))}
              <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: "60%" }}
                  icon={<PlusOutlined />}
                >
                  Add Sub Task
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default TaskFormModal;
