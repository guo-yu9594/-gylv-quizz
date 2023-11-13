import { title, subtitle } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Welcome to our &nbsp;</h1>
        <h1 className={title({ color: "violet" })}>beautiful&nbsp;</h1>
        <h1 className={title()}>Quiz.</h1>
      </div>
      <div className="flex flex-col mt-12 space-y-4 items-center">
        <Link href="single">
          <Button color="primary" variant="flat" size="lg">
            Singleplayer
          </Button>
        </Link>
        <Link href="multi">
          <Button color="primary" variant="shadow" size="lg">
            Multiplayer
          </Button>
        </Link>
      </div>
    </section>
  );
}
