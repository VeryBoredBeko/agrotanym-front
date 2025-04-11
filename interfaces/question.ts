export interface Question {
  id: string;
  userID: string;
  title: string;
  body: string;
  views: number;
  votesCount: number;
  answersCount: number;
  isClosed: boolean;
  createdAt: string;
  updatedAT: string;
  isVoted: boolean;
  voteType: string;
  isOwner: boolean;
}

export interface Tag {
  name: string;
}
