"use client";

import { Card, Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <Card
      className={`w-full min-h-full p-8 space-y-12 justify-center`}
      shadow="sm"
    >
      <Spinner size="lg" label="Generating the questions..." labelColor="primary" />
    </Card>
  );
}
