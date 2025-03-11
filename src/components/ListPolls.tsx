"use client";

import { getPolls } from "@/lib/api";
import { IPoll } from "@/types";
import { useQuery } from "@tanstack/react-query";
// import Link from "next/link";
import { useRouter } from "next/navigation";

const ListPolls = () => {
  const { data } = useQuery({
    queryKey: ["polls"],
    queryFn: () => getPolls(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6 bg-white shadow-md p-4 rounded">
        <h2 className="text-2xl font-bold">Polls</h2>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
          onClick={() => router.push("/create-poll")}
        >
          + New Poll
        </button>
      </div>

      {data?.data.length > 0 ? (
        data.data.map(
          (poll: IPoll) =>
            !poll.isPrivate && (
              <div
                key={poll._id}
                className=" p-4 mb-4 rounded shadow-md bg-white"
              >
                <h3 className="text-lg font-semibold">{poll.question}</h3>
                <p className="text-sm text-gray-600">Type: {poll.pollType}</p>
                <p className="text-sm text-gray-600">
                  Expires: {new Date(poll.expiresAt).toLocaleDateString()}
                </p>
                <div className="mt-2 flex justify-end items-center">
                  {/* <Link
                    href={`/poll/${poll._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View Poll
                  </Link> */}
                  <button
                    className="text-sm text-gray-500 hover:text-gray-700"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}/poll/vote/${poll._id}/`
                      )
                    }
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )
        )
      ) : (
        <p className="text-gray-600 text-center">No polls available.</p>
      )}
    </div>
  );
};

export default ListPolls;
