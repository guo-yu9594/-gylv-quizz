import { title, subtitle } from "@/components/primitives";
import Quiz from "../components/Quiz";

export default function Single() {
  return (
    <section className="flex flex-col items-center h-full w-full">
      <Quiz />
    </section>
  );
}
