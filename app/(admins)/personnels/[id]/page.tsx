import React from "react";

type PersonnelPageProps = {
  params: Promise<{ id: string }>;
};

async function PersonnelPage({ params }: PersonnelPageProps) {
  const { id } = await params;

  return <div>Personnel : {id}</div>;
}

export default PersonnelPage;
