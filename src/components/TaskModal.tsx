// src/components/TaskModal.tsx

import { useState } from "react";
import { TaskType } from "../types";

interface Props {
  onClose: () => void;
  onSubmit: (content: string, type: TaskType) => void;
}

const TaskModal = ({ onClose, onSubmit }: Props) => {
  const [content, setContent] = useState("");
  const [type, setType] = useState<TaskType>("successToast");

  const getPlaceholderText = () => {
    switch (type) {
      case "successToast":
        return "Enter the success toast message...";
      case "errorToast":
        return "Enter the error toast message...";
      case "chatGPTQuery":
        return "Enter the prompt for ChatGPT...";
      default:
        return "Task content...";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content, type);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-lg flex-col gap-4 rounded-md bg-columnBackgroundColor p-6"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Create New Executable Task</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-mainBackgroundColor hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Task Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TaskType)}
              className="w-full rounded-md border-2 border-mainBackgroundColor bg-black p-2 text-white outline-none focus:border-rose-500"
            >
              <option value="successToast">Success Toast</option>
              <option value="errorToast">Error Toast</option>
              <option value="chatGPTQuery">ChatGPT Query</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={getPlaceholderText()}
              autoFocus
              className="h-[150px] w-full resize-none rounded-md border-2 border-mainBackgroundColor bg-black p-2 text-white outline-none focus:border-rose-500"
            ></textarea>
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-mainBackgroundColor px-4 py-2 text-white hover:bg-opacity-80"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="rounded-md bg-rose-500 px-4 py-2 text-white hover:bg-rose-600 disabled:opacity-50"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;