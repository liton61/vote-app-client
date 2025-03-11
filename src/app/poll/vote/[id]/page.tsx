import VotePoll from "@/components/VotePoll";
import React from "react";

const VotePage = ({ params }: { params: { id: string } }) => {
  return <VotePoll id={params.id} />;
};

export default VotePage;
