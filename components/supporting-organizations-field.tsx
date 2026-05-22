"use client";

import { Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/button";
import { inputStyles } from "@/components/panel";

const commonOrganizations = [
  "Sheriff's Office",
  "Police Department",
  "Fire Department",
  "EMS",
  "Public Works",
  "911 / Emergency Communications",
  "Public Health",
  "Hospital / Healthcare Coalition",
  "School District",
  "Utility Provider",
  "Volunteer Organizations",
  "State Emergency Management",
  "National Guard",
  "Transportation / Transit",
  "Public Information Officer",
  "Other"
];

export function SupportingOrganizationsField() {
  const [selected, setSelected] = useState<string[]>([]);
  const [organization, setOrganization] = useState("");
  const [customOrganization, setCustomOrganization] = useState("");

  const remainingOrganizations = useMemo(
    () => commonOrganizations.filter((item) => item === "Other" || !selected.includes(item)),
    [selected]
  );

  function addOrganization(value: string) {
    const next = value.trim();

    if (!next || next === "Other" || selected.includes(next)) {
      return;
    }

    setSelected((current) => [...current, next]);
    setOrganization("");
    setCustomOrganization("");
  }

  function removeOrganization(value: string) {
    setSelected((current) => current.filter((item) => item !== value));
  }

  return (
    <div className="grid gap-3">
      <input type="hidden" name="supporting_orgs" value={selected.join(", ")} />
      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <select
          data-testid="supporting-organization-select"
          className={inputStyles}
          value={organization}
          onChange={(event) => setOrganization(event.target.value)}
        >
          <option value="">Select a supporting organization</option>
          {remainingOrganizations.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <Button
          data-testid="add-selected-organization"
          type="button"
          variant="light"
          onClick={() => addOrganization(organization)}
          disabled={!organization || organization === "Other"}
        >
          <Plus size={16} />
          Add Selected
        </Button>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <input
          data-testid="custom-organization-input"
          className={inputStyles}
          value={customOrganization}
          onChange={(event) => setCustomOrganization(event.target.value)}
          placeholder="Add another partner, agency, department, or private-sector organization"
        />
        <Button
          data-testid="add-custom-organization"
          type="button"
          variant="subtle"
          onClick={() => addOrganization(customOrganization)}
          disabled={!customOrganization.trim()}
        >
          <Plus size={16} />
          Add Custom
        </Button>
      </div>

      <div className="min-h-14 rounded-md border border-line bg-panel p-3">
        {selected.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selected.map((item) => (
              <span key={item} className="inline-flex items-center gap-2 rounded-md border border-flare/40 bg-flare/10 px-3 py-2 text-sm font-semibold text-ink">
                {item}
                <button
                  type="button"
                  className="inline-flex size-6 items-center justify-center rounded-md text-flare hover:bg-field hover:text-ink"
                  onClick={() => removeOrganization(item)}
                  aria-label={`Remove ${item}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm font-normal leading-6 text-steel">Add the organizations that will participate, support, observe, or be affected by the exercise.</p>
        )}
      </div>
    </div>
  );
}
