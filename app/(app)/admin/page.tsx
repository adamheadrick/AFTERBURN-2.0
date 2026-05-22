import { CreditCard, Inbox, KeyRound, UsersRound } from "lucide-react";
import { PageTitle } from "@/components/page-title";
import { WorkflowStepCard } from "@/components/workflow-step-card";

const cards = [
  {
    title: "Review and Publish Intake",
    eyebrow: "1. Screened intake",
    description: "Review Dropoff submissions, read AI screening reports, sanitize sensitive details, and convert approved items into useful records.",
    href: "/admin/dropoff",
    action: "Open queue",
    metric: "Screening",
    icon: Inbox,
    links: [
      { label: "Dropoff Review Queue", href: "/admin/dropoff", note: "Approve, reject, sanitize, merge, link, or convert submissions into lessons, AAR findings, POA&M items, or future inputs." }
    ]
  },
  {
    title: "Configuration and Credentials",
    eyebrow: "2. App setup",
    description: "Keep preview/live mode, Supabase, OpenAI, storage, and future map integration guidance in one controlled place.",
    href: "/settings",
    action: "Open settings",
    metric: ".env.local",
    icon: KeyRound,
    links: [
      { label: "Settings", href: "/settings", note: "Environment guidance, Supabase auth/storage, OpenAI API, and future integration setup." }
    ]
  },
  {
    title: "Users, Organizations, and Roles",
    eyebrow: "3. Access control",
    description: "Future role-based access for planners, exercise control, evaluators, participants, leaders, partner organizations, and admins.",
    href: "/settings",
    action: "Review access model",
    metric: "Future",
    icon: UsersRound,
    links: [
      { label: "Users", href: "/settings", note: "Invite-only logins for planners, evaluators, participants, leadership, and administrators." },
      { label: "Organizations / Partners", href: "/settings", note: "Agency profiles, points of contact, capabilities, and recurring gaps." },
      { label: "Roles / Permissions", href: "/settings", note: "Planner, controller, evaluator, participant, leader, entity lead, admin, and super admin roles." }
    ]
  },
  {
    title: "Licensing and Integrations",
    eyebrow: "4. Product controls",
    description: "Future subscription, authorized-user counts, term discounts, government pricing, billing hooks, and integration settings.",
    href: "/settings",
    action: "View setup",
    metric: "Future",
    icon: CreditCard,
    links: [
      { label: "Subscription / Licensing", href: "/settings", note: "Authorized-user pricing, 12/24/36-month terms, and government/interagency models." },
      { label: "Credentials / Integrations", href: "/settings", note: "Future map, storage, document export, email reminder, and identity-provider integrations." }
    ]
  }
];

export default function AdminPage() {
  return (
    <div className="grid gap-6">
      <PageTitle
        eyebrow="Admin"
        title="Settings, Access, and Product Controls"
        description="Manage configuration while preserving clear homes for users, partner organizations, permissions, credentials, integrations, and future subscription controls."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        {cards.map((card) => <WorkflowStepCard key={card.title} {...card} />)}
      </section>
    </div>
  );
}
