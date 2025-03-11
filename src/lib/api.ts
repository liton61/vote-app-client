import { IPoll } from "@/types";
import API from "./axios-client";

// Polls
export const createPoll = async (poll: IPoll) => {
  const res = await API.post("/polls", poll);
  return res.data;
};

export const getPolls = async () => {
  const res = await API.get("/polls");
  return res.data;
};

export const getPoll = async (id: string) => {
  const res = await API.get(`/polls/${id}`);
  return res.data.data;
};

// Vote on a poll
export const votePoll = async (id: string, optionIndex: number) => {
  const res = await API.post(`/polls/${id}/votes`, { optionIndex });
  return res.data;
};

// Comments
export const createComment = async (pollId: string, text: string) => {
  const res = await API.post(`/polls/${pollId}/comments`, { text });
  return res.data;
};

// Reactions
export const createReaction = async (pollId: string, reactionType: string) => {
  const res = await API.post(`/polls/${pollId}/reactions`, { reactionType });
  return res.data;
};
