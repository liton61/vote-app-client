import VotePoll from "@/components/VotePoll";
import { Params } from "next/dist/server/request/params";
import React from "react";

type PageProps = {
  params: Promise<Params>;
};

const page = async ({ params }: PageProps) => {
  const { id } = await params;

  return <VotePoll id={id} />;
};

export default page;
