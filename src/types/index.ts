export type IPollOption = {
  _id?: string;
  text: string;
  votes: number;
};

export type IPollType = "multiple-choice" | "yes-no";

export type IPoll = {
  _id?: string;
  question: string;
  pollType: IPollType;
  options: IPollOption[];
  expiresAt: Date;
  hideResults: boolean;
  isPrivate?: boolean;
  anonymousId?: string;
  comments?: IComment[];
  reactions?: IReactions[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type IVote = {
  pollId: string;
  pollType: IPollType;
  optionIndex: number;
  anonymousId: string;
  createdAt?: Date;
};

export type IComment = {
  pollId: string;
  text: string;
  anonymousId: string;
};

export enum ReactionType {
  Trending = "trending",
  Like = "like",
}

export type IReactions = {
  pollId: string;
  reactionType: ReactionType;
  anonymousId: string;
  createdAt?: Date | string;
};
