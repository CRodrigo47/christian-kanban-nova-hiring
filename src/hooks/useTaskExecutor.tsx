import { useState } from "react";
import { Task } from "../types";
import { toast } from "react-hot-toast";
import axios from "axios";

// Delay function
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const useTaskExecutor = () => {

  const [isLoading, setIsLoading] = useState(false);

  const handleChatGPTQuery = async (prompt: string) => {
    // Use .env variable
    const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

    if (!API_KEY) {
      toast.error("OpenAI API Key not found. Check your .env file.");
      setIsLoading(false);
      return;
    }

    const loadingToastId = toast.loading("Sending to ChatGPT...");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-5-mini-2025-08-07",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      const message = response.data.choices[0].message.content;

      toast.success(
        (t) => (
          <div className="max-w-md">
            <div className="flex justify-between items-center mb-1">
              <strong className="block">ChatGPT Responds:</strong>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="text-sm font-medium text-gray-400 hover:text-white hover:bg-mainBackgroundColor rounded-md px-2 py-1"
              >
                X
              </button>
            </div>
            <div
              className="task" // Scrollbar style
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                paddingRight: "8px",
              }}
            >
              <p style={{ whiteSpace: "pre-wrap" }}>{message}</p>
            </div>
          </div>
        ),
        { id: loadingToastId, duration: 15000 }
      );
    } catch (error) {
      // Error management
      let errorMsg = "An unknown error occurred.";
      if (axios.isAxiosError(error) && error.response) {
        errorMsg =
          error.response.data.error?.message || "Failed to get response.";
      } else if (error instanceof Error) {
        errorMsg = error.message;
      }
      toast.error(`ChatGPT Error: ${errorMsg}`, {
        id: loadingToastId,
        duration: 5000,
      });
    }
  };

  // Main Execute Function
  const executeTasks = async (tasks: Task[]) => {
    setIsLoading(true);
    for (const task of tasks) {
      switch (task.type) {
        case "successToast":
          toast.success(task.content, {duration: 2000});
          break;
        case "errorToast":
          toast.error(task.content, {duration: 2000});
          break;
        case "chatGPTQuery":
          await handleChatGPTQuery(task.content);
          break;
      }
      await delay(1500);
    }
    setIsLoading(false);
  };

  return { isLoading, executeTasks };
};