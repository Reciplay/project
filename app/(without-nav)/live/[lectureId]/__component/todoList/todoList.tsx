"use client";

const recipe = {
  title: "Delicious Pancakes",
  chapters: [
    {
      id: 1,
      title: "Preparation",
      steps: [
        { id: 1, description: "Gather all ingredients" },
        { id: 2, description: "Mix flour and sugar" },
      ],
    },
    {
      id: 2,
      title: "Cooking",
      steps: [
        { id: 3, description: "Heat the pan" },
        { id: 4, description: "Pour batter into pan" },
        { id: 5, description: "Flip pancakes when bubbles form" },
      ],
    },
  ],
};

export function TodoList() {
  return (
    <div>
      <h2>{recipe.title} Checklist</h2>
      {recipe.chapters.map((chapter) => (
        <div key={chapter.id}>
          <h3>{chapter.title}</h3>
          <ul>
            {chapter.steps.map((step) => (
              <li key={step.id}>
                <input type="checkbox" id={`step-${step.id}`} />
                <label htmlFor={`step-${step.id}`}>{step.description}</label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
