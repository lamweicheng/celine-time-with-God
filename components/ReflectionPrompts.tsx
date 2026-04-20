const prompts = [
  'What stands out to you in this passage?',
  'What is God teaching you here?',
  'How can you apply this today?',
  'Is there a promise, command, or warning to notice?'
];

export function ReflectionPrompts() {
  return (
    <div className="rounded-[24px] border border-white/35 bg-white/45 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:rgb(var(--muted))]">Reflection prompts</p>
      <ul className="mt-3 space-y-2 text-sm leading-7 text-[color:rgb(var(--muted-strong))]">
        {prompts.map((prompt) => (
          <li key={prompt}>{prompt}</li>
        ))}
      </ul>
    </div>
  );
}