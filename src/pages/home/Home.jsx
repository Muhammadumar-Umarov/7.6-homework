import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api";
import {
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
} from "antd";
import { Pencil, Trash2 } from "lucide-react";

const Users = () => {
  const [editItem, setEditItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/users"),
  });

  // Delete user
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => {
      message.success("User successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleEdit = (user) => {
    setEditItem(user);
    showModal();
  };

  const onFinish = (values) => {
    api.put(`/users/${editItem.id}`, values).then(() => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      message.success("User updated");
      setIsModalOpen(false);
    });
  };

  return (
    <>
    <h1 className="text-center text-4xl my-[24px] font-semibold">Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-8 max-w-7xl mx-auto">
        {data?.data?.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300"
          >
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-2xl flex flex-col items-center">
              <img
                src={user.image}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
              <p className="text-sm opacity-90">{user.profession}</p>
            </div>

            <div className="p-6 text-gray-700 text-sm space-y-2">
              <p>
                <span className="font-semibold">Age:</span> {user.age}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{" "}
                {user.isMarried ? (
                  <span className="text-green-600 font-medium">Married</span>
                ) : (
                  <span className="text-red-500 font-medium">Single</span>
                )}
              </p>
            </div>

            <div className="flex justify-between px-6 pb-6">
              <Button
                type="primary"
                className="bg-blue-500 hover:bg-blue-600"
                icon={<Pencil size={16} />}
                onClick={() => handleEdit(user)}
              >
                Edit
              </Button>
              <Popconfirm
                title="Are you sure you want to delete?"
                onConfirm={() => handleDelete(user.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button danger icon={<Trash2 size={16} />}>
                  Delete
                </Button>
              </Popconfirm>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        title="Edit User"
        footer={null}
      >
        <Form
          name="edit-user"
          initialValues={editItem}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Image URL"
            name="image"
            rules={[{ required: true, message: "Please enter image url" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Profession"
            name="profession"
            rules={[{ required: true, message: "Please enter profession" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Age"
            name="age"
            rules={[{ required: true, message: "Please enter age" }]}
          >
            <InputNumber className="w-full" />
          </Form.Item>

          <Form.Item label="Married" name="isMarried" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Users;
