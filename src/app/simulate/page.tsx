import { SimulationShell } from "@/components/chat/simulation-shell";

export default function SimulatePage() {
  return (
    <main className="flex min-h-svh flex-1 flex-col">
      <SimulationShell badge="Simulação · /simulate" />
    </main>
  );
}
