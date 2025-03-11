/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPoll, votePoll, createComment, createReaction } from "@/lib/api";
import { ThumbsUp, TrendingUp } from "lucide-react";

// Define your data types with proper structure
export type IPollOption = {
  _id?: string;
  text: string;
  votes: number;
};

export type IPollType = "multiple-choice" | "yes-no";

export type IComment = {
  _id?: string;
  pollId: string;
  text: string;
  anonymousId: string;
  createdAt?: Date | string;
};

export enum ReactionType {
  Trending = "trending",
  Like = "like",
}

export type IReaction = {
  _id?: string;
  pollId: string;
  reactionType: ReactionType;
  anonymousId: string;
  createdAt?: Date | string;
};

export type IPoll = {
  _id?: string;
  question: string;
  pollType: IPollType;
  options: IPollOption[];
  expiresAt: Date | string;
  hideResults: boolean;
  isPrivate?: boolean;
  anonymousId?: string;
  comments?: IComment[];
  reactions?: IReaction[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type IVotePayload = {
  pollId: string;
  optionIndex: number;
};

export type ICommentPayload = {
  pollId: string;
  text: string;
};

export type IReactionPayload = {
  pollId: string;
  reactionType: ReactionType;
};

const VotePoll = ({ id }: { id: string }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  // Fetch poll data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["polls", id],
    queryFn: () => getPoll(id) as Promise<IPoll>,
  });

  // Mutation for voting
  const voteMutation = useMutation({
    mutationFn: (payload: IVotePayload) =>
      votePoll(payload.pollId, payload.optionIndex),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["polls", id],
      });
    },
  });

  // Mutation for commenting
  const commentMutation = useMutation({
    mutationFn: (payload: ICommentPayload) =>
      createComment(payload.pollId, payload.text),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["polls", id],
      });
      setComment("");
    },
  });

  // Mutation for reacting
  const reactionMutation = useMutation({
    mutationFn: (payload: IReactionPayload) =>
      createReaction(payload.pollId, payload.reactionType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["polls", id],
      });
    },
  });

  const handleVote = () => {
    if (selectedOption !== null && data?._id) {
      voteMutation.mutate({
        pollId: id,
        optionIndex: selectedOption,
      });
    }
  };

  const handleComment = () => {
    if (comment.trim() && data?._id) {
      commentMutation.mutate({
        pollId: id,
        text: comment,
      });
    }
  };

  const handleReaction = (reactionType: ReactionType) => {
    if (data?._id) {
      reactionMutation.mutate({
        pollId: id,
        reactionType,
      });
    }
  };

  // Calculate reaction counts
  const getLikeCount = () => {
    return (
      data?.reactions?.filter(
        (r) =>
          r.reactionType === ReactionType.Like ||
          r.reactionType === ("like" as any),
      ).length || 0
    );
  };

  const getTrendingCount = () => {
    return (
      data?.reactions?.filter(
        (r) =>
          r.reactionType === ReactionType.Trending ||
          r.reactionType === ("trending" as any),
      ).length || 0
    );
  };

  // Format date for display
  const formatDate = (dateString?: Date | string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate total votes
  const getTotalVotes = () => {
    return data?.options.reduce((sum, option) => sum + option.votes, 0) || 0;
  };

  // Calculate percentage for each option
  const getPercentage = (votes: number) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600 max-w-lg mx-auto mt-8">
        <h2 className="font-semibold text-lg">Error loading poll</h2>
        <p>Unable to load the poll data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      {/* Poll Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{data.question}</h1>
        <div className="flex text-sm text-gray-500 justify-between">
          <p>Poll expires: {formatDate(data.expiresAt)}</p>
          <p>Total votes: {getTotalVotes()}</p>
        </div>
      </div>

      {/* Poll Options */}
      <div className="space-y-4 mb-6">
        {data.options.map((option, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <div
              className="flex items-center p-3 cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedOption(index)}
            >
              <div className="mr-3">
                <input
                  type="radio"
                  id={`option-${index}`}
                  name="vote"
                  value={index}
                  checked={selectedOption === index}
                  onChange={() => setSelectedOption(index)}
                  className="h-4 w-4 text-blue-600"
                />
              </div>
              <label
                htmlFor={`option-${index}`}
                className="flex-grow font-medium"
              >
                {option.text}
              </label>
              <div className="text-gray-500 ml-2">
                {option.votes} {option.votes === 1 ? "vote" : "votes"}
              </div>
            </div>

            {/* Progress bar for results */}
            {!data.hideResults && (
              <div className="w-full bg-gray-200 h-2">
                <div
                  className="bg-blue-600 h-2"
                  style={{ width: `${getPercentage(option.votes)}%` }}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Vote Button */}
      <div className="mb-8">
        <button
          onClick={handleVote}
          disabled={selectedOption === null || voteMutation.isPending}
          className={`w-full py-2 px-4 rounded-md font-medium ${
            selectedOption === null
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {voteMutation.isPending ? "Submitting..." : "Vote Now"}
        </button>
      </div>

      {/* Poll Results Section */}
      {!data.hideResults && (
        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Poll Results</h2>
          <div className="space-y-2">
            {data.options.map((option, index) => (
              <div key={index} className="flex justify-between">
                <span>{option.text}:</span>
                <span className="font-medium">
                  {option.votes} votes ({getPercentage(option.votes)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reactions Section */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => handleReaction(ReactionType.Like)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
            reactionMutation.isPending
              ? "opacity-50 cursor-wait"
              : "hover:bg-gray-100"
          }`}
          disabled={reactionMutation.isPending}
        >
          <ThumbsUp className="h-5 w-5 text-blue-500" />
          <span>{getLikeCount()}</span>
        </button>

        <button
          onClick={() => handleReaction(ReactionType.Trending)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
            reactionMutation.isPending
              ? "opacity-50 cursor-wait"
              : "hover:bg-gray-100"
          }`}
          disabled={reactionMutation.isPending}
        >
          <TrendingUp className="h-5 w-5 text-green-500" />
          <span>{getTrendingCount()}</span>
        </button>
      </div>

      {/* Comment Section */}
      <div className="border-t pt-6">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>

        {/* Comment input */}
        <div className="mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <button
            onClick={handleComment}
            disabled={!comment.trim() || commentMutation.isPending}
            className={`mt-2 px-4 py-2 rounded-md ${
              !comment.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {commentMutation.isPending ? "Posting..." : "Post Comment"}
          </button>
        </div>

        {/* Comments list */}
        {data.comments && data.comments.length > 0 ? (
          <div className="space-y-4">
            {data.comments.map((cmt, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2">{cmt.text}</p>
                {cmt.createdAt && (
                  <p className="text-sm text-gray-500">
                    Posted on {formatDate(cmt.createdAt)}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default VotePoll;
