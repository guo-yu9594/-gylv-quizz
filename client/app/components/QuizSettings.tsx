"use client";

import { Button, Card, Select, SelectItem, Spinner } from "@nextui-org/react";
import { useState } from "react";

export type Difficulty = "easy" | "normal" | "hard";

export type Settings = {
  difficulty: Difficulty;
};

export type QuizSettingsProps = {
  next: (settings: Settings) => void;
};

const difficulties: Difficulty[] = ["easy", "normal", "hard"];

const QuizSettings: React.FC<QuizSettingsProps> = ({ next }) => {
  const [settings, setSettings] = useState<Settings>({
    difficulty: "normal",
  });
  const [error, setError] = useState(false);

  const handleNext = () => {
    if (!settings.difficulty || settings.difficulty.length <= 0) setError(true);
    else next(settings);
  };

  return (
    <Card
      className={`w-full min-h-full p-8 space-y-12 justify-center`}
      shadow="sm"
    >
      <Select
        required
        errorMessage={error ? "Select a difficulty" : null}
        isInvalid={error}
        label="Select a difficulty"
        className="max-w-xs"
        defaultSelectedKeys={[settings.difficulty]}
        onChange={(e) =>
          setSettings({
            ...settings,
            difficulty: e.target.value as Difficulty,
          })
        }
      >
        {difficulties.map((difficulty) => (
          <SelectItem key={difficulty} value={difficulty}>
            {difficulty}
          </SelectItem>
        ))}
      </Select>
      <Button className="mt-8" size="lg" color="primary" onClick={handleNext}>
        Next
      </Button>
    </Card>
  );
};

export default QuizSettings;
