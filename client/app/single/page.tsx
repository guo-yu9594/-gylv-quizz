"use client";

import { title, subtitle } from "@/components/primitives";
import Quiz from "../components/Quiz";
import { useEffect } from "react";
import SocketServices from "@/services/SocketServices";

const socket = new SocketServices();

export default function Single() {
  useEffect(() => {
    socket.single();
  }, []);
  return (
    <section className="flex flex-col items-center h-full w-full">
      <Quiz />
    </section>
  );
}
