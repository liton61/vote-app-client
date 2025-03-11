"use client";

import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPoll } from "@/lib/api";
import React from "react";
import { IPoll } from "@/types";
import { useRouter } from "next/navigation";

const CreatePoll = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, control, watch } = useForm<IPoll>({
    defaultValues: {
      question: "",
      pollType: "multiple-choice",
      options: [{ text: "", votes: 0 }],
      expiresAt: new Date(),
      hideResults: false,
      isPrivate: false,
    },
  });

  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: ["createPoll"],
    mutationFn: createPoll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["polls"] });
      router.push("/");
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const onSubmit = (data: IPoll) => {
    mutation.mutate(data);
  };

  return (
    <>
      <div className="flex w-full justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow border border-gray-300">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Create a Poll
          </h2>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Question
              </label>
              <input
                {...register("question", { required: true })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your poll question"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Poll Type
              </label>
              <select
                {...register("pollType")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="multiple-choice">Multiple Choice</option>
                <option value="yes-no">Yes / No</option>
              </select>
            </div>

            {watch("pollType") === "multiple-choice" && (
              <div>
                <label className="block text-gray-800 font-medium mb-2">
                  Options
                </label>
                <Controller
                  control={control}
                  name="options"
                  render={({ field }) => (
                    <div>
                      {field.value.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 mb-2"
                        >
                          <input
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Option ${index + 1}`}
                            value={option.text}
                            onChange={(e) => {
                              const newOptions = [...field.value];
                              newOptions[index].text = e.target.value;
                              field.onChange(newOptions);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = [...field.value];
                              newOptions.splice(index, 1);
                              field.onChange(newOptions);
                            }}
                            className="px-3 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() =>
                          field.onChange([
                            ...field.value,
                            { text: "", votes: 0 },
                          ])
                        }
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                      >
                        + Add Option
                      </button>
                    </div>
                  )}
                />
              </div>
            )}

            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Expires At
              </label>
              <input
                type="date"
                {...register("expiresAt", { required: true })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                {...register("hideResults")}
                className="h-5 w-5 text-blue-600"
              />
              <label className="text-gray-800">Hide Results</label>
            </div>

            <div className="flex items-center w-full gap-3 justify-between">
              <button
                type="submit"
                className=" px-4 py-2 w-full bg-green-500 text-white rounded shadow  hover:bg-green-600"
              >
                Create Poll
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 w-full bg-blue-500 text-white rounded shadow hover:bg-blue-600"
              >
                Go Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePoll;
