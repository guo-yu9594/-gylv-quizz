"use client";

import { Card, Spinner } from "@nextui-org/react";

type LoadingProps = {
  label?: string;
};

const Loading: React.FC<LoadingProps> = ({ label }) => {
  return (
    <Card
      className={`w-full min-h-full p-8 space-y-12 justify-center`}
      shadow="sm"
    >
      <Spinner
        size="lg"
        label={label}
        labelColor="primary"
      />
    </Card>
  );
}

export default Loading