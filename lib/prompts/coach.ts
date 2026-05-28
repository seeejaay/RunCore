import type { CoachPromptInput } from "@/@types/CoachPromptInput"

export function buildCoachPrompt(input: CoachPromptInput): string {
  const { age, weight, height, goal, programWeeks, frequency, tenKmTime } =
    input

  return `
    You are an experienced running coach tasked with creating a personalized training plan for a runner based in Quezon City, Philippines. The plan should be designed to help the runner be fully prepared and physically ready to achieve their goal, with the following criteria/characteristics:
    Generate a progressive plan that gradually increases in intensity and volume over the course of the program, ensuring the runner builds endurance, speed, and strength while minimizing the risk of injury.

    RUNNER PROFILE:
    - Age: ${age}
    - Weight: ${weight} kg
    - Height: ${height} cm
    - Goal Race: ${goal}
    - Total Program Length: ${programWeeks} weeks - should be based on the runner's current fitness level,demands of the goal, need for recovery, principle of progressive overload, and the runner's schedule and lifestyle, and the date of which the goal is to be attempted.
    - Current 10km Personal Best: ${tenKmTime}

    CONSTRAINTS:
    - Exactly ${frequency} runs per week.
    - All activities should fit the runners work schedule of 1:00 PM to 9:00 PM, Monday to Friday, and should not interfere with the runner's work commitments.
    - Include a mix of run types (e.g., Easy, Long, Interval, Tempo).

    OUTPUT FORMAT (Strict JSON):
    [
      { "day": "Tuesday", "type": "Interval", "distance": 8, "description": "e.g., 8x1km repeats at goal pace", "focus": "Speed" },
      ...
    ]
  `
}
