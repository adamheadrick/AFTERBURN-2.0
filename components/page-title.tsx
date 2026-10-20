"use client";
import { usePathname } from "next/navigation";
import { toolForPath, workspaceForPath } from "@/lib/workspace-navigation";

export function PageTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  const path = usePathname();
  const tool = toolForPath(path);
  const section = workspaceForPath(path);
  return <div className="page-heading">
    <p className="workspace-eyebrow">{tool && section ? section.label : eyebrow}</p>
    <h1>{tool?.label ?? title}</h1>
    <p className="page-description">{description}</p>
  </div>;
}
