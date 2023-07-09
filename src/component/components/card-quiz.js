import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from "@ant-design/icons";
import axios from "axios";
import { Avatar, Card, message, Modal, Form, Input,Button } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const { Meta } = Card;

const AddButton = styled(Button)`
  margin-top: 16px;
  background-color: #1890ff;
  color: #fff;
  border-color: #1890ff;
  width: fit-content;
  textAlign

  &:hover,
  &:focus {
    background-color: #40a9ff;
    border-color: #40a9ff;
  }
`;

const CardQuiz = () => {

  const [data, setData] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editQuiz, setEditQuiz] = useState(null);
  const [deleteQuizId, setDeleteQuizId] = useState(null);
  const [form] = Form.useForm();
  const [addModalVisible, setAddModalVisible] = useState(false);
  
   async function getAll() {
     const res = await axios.get(`${process.env.REACT_APP_BACK_END}/api/quiz/getall`);
     setData(res.data);
     console.log("dsadas" + data);
   }
   useEffect(() => {
     getAll();
   }, []);

   function toastSuccess(message) {
     toast.success(message, {
       position: toast.POSITION.TOP_RIGHT,
     });
   }

   function toastWarning(message) {
     toast.warning(message, {
       position: toast.POSITION.TOP_RIGHT,
     });
   }

   const showEditModal = (quiz) => {
     setEditModalVisible(true);
     setEditQuiz(quiz);
     form.setFieldsValue({
       question: quiz.question,
       answer: quiz.answer,
     });
   };

   const handleEditCancel = () => {
     setEditModalVisible(false);
     setEditQuiz(null);
     form.resetFields();
   };

   const showDeleteModal = (id) => {
     setDeleteModalVisible(true);
     setDeleteQuizId(id);
   };

   const handleDeleteOk = async () => {
     try {
       await axios.delete(
         `${process.env.REACT_APP_BACK_END}/api/quiz/del/${deleteQuizId}`
       );
       toastSuccess("Xóa thành công");
       setDeleteModalVisible(false);
       setDeleteQuizId(null);
       getAll();
     } catch (error) {
       toastWarning("Xóa lỗi:", error);
     }
   };

   const handleDeleteCancel = () => {
     setDeleteModalVisible(false);
     setDeleteQuizId(null);
   };

   const handleEditOk = async () => {
     try {
       const values = await form.validateFields();
       const body = {
         id: editQuiz.id,
         question: values.question,
         answer: values.answer,
       };
       await axios.put(
         `${process.env.REACT_APP_BACK_END}/api/quiz/change`,
         body
       );
       toastSuccess("Thay đổi thành công");
       setEditModalVisible(false);
       setEditQuiz(null);
       form.resetFields();
       getAll();
     } catch (error) {
       console.log("Lỗi:", error);
     }
   };

   const showAddModal = () => {
     setAddModalVisible(true);
   };

   const handleAddOk = async () => {
     try {
       const values = await form.validateFields();
       const body = {
         question: values.question,
         answer: values.answer,
       };
       await axios.post(`${process.env.REACT_APP_BACK_END}/api/quiz/save`, body);
       toastSuccess("Thêm thành công");
       setAddModalVisible(false);
       form.resetFields();
       getAll();
     } catch (error) {
       console.log("Lỗi:", error);
     }
   };

   const handleAddCancel = () => {
     setAddModalVisible(false);
     form.resetFields();
   };
  return (
    <>
      <ToastContainer></ToastContainer>
      <AddButton
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginTop: 16 }}
        onClick={showAddModal}
      ></AddButton>
      {data.map((quiz) => {
        return (
          <>
            <Card
              style={{
                width: 300,
                marginTop: 16,
              }}
              actions={[
                <EditOutlined key="edit" onClick={() => showEditModal(quiz)} />,
                <DeleteOutlined
                  key="del"
                  onClick={() => showDeleteModal(quiz.id)}
                />,
              ]}
            >
              <Meta title={quiz.question} description={quiz.answer} />
            </Card>
          </>
        );
      })}
      <Modal
        title="Chỉnh sửa câu hỏi"
        visible={editModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="question"
            label="Câu hỏi "
            rules={[{ required: true, message: "Nhập câu hỏi câu" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="answer"
            label="Câu trả lời"
            rules={[{ required: true, message: "Nhập câu trả lời" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Xóa câu hỏi"
        visible={deleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        cancelText="Hủy"
        okText="Xóa"
        okType="danger"
      >
        <p>Bạn có muốn xóa??</p>
      </Modal>

      <Modal
        title="Thêm câu hỏi"
        visible={addModalVisible}
        onOk={handleAddOk}
        onCancel={handleAddCancel}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="question"
            label="Câu hỏi"
            rules={[{ required: true, message: "Please enter a question" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="answer"
            label="Câu trả lời"
            rules={[{ required: true, message: "Please enter an answer" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Button */}
    </>
  );
};
export default CardQuiz;
