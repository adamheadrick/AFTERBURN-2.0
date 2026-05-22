"use client";

import { Check, Circle, HelpCircle, MapPinned, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/button";
import { Field, inputStyles } from "@/components/panel";

export function GraphicOverviewBuilder({
  mapSrc,
  layers,
  lanes
}: {
  mapSrc: string;
  layers: string[];
  lanes: string[];
}) {
  const coreLayers = useMemo(() => layers.slice(0, 4), [layers]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>(coreLayers);

  function toggleLayer(layer: string) {
    setSelectedLayers((current) =>
      current.includes(layer) ? current.filter((item) => item !== layer) : [...current, layer]
    );
  }

  return (
    <div className="grid gap-5 p-5">
      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <iframe
          title="Exercise area map"
          className="min-h-[560px] w-full rounded-md border border-line bg-night"
          src={mapSrc}
          loading="lazy"
        />

        <div className="grid content-start gap-4">
          <section className="rounded-md border border-line bg-night p-4">
            <div className="flex items-center gap-2">
              <MapPinned className="text-flare" size={18} />
              <p className="text-xs font-black uppercase tracking-[0.16em] text-flare">Graphic layers</p>
            </div>
            <div className="mt-4 grid gap-2">
              {layers.map((layer) => {
                const selected = selectedLayers.includes(layer);

                return (
                  <button
                    key={layer}
                    className={`flex items-start gap-3 rounded-md border p-3 text-left text-sm font-semibold leading-5 transition ${
                      selected ? "border-flare/60 bg-flare/10 text-ink" : "border-line bg-panel text-steel hover:bg-field hover:text-ink"
                    }`}
                    type="button"
                    onClick={() => toggleLayer(layer)}
                  >
                    {selected ? <Check className="mt-0.5 shrink-0 text-flare" size={16} /> : <Circle className="mt-0.5 shrink-0 text-steel" size={16} />}
                    <span>{layer}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="ghost" type="button" onClick={() => setSelectedLayers(coreLayers)}>
                <RotateCcw size={16} />
                Core Layers
              </Button>
            </div>
          </section>

          <section className="rounded-md border border-line bg-night p-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="text-flare" size={18} />
              <p className="text-xs font-black uppercase tracking-[0.16em] text-flare">Map questions to resolve</p>
            </div>
            <textarea
              className={`${inputStyles} mt-4 min-h-36 w-full`}
              placeholder="What must be confirmed before this graphic is brief-ready? Example: road closures, shelter status, staging location, backup EOC, communications dead zones."
            />
          </section>
        </div>
      </div>

      <section className="grid gap-4 rounded-md border border-line bg-night p-4 lg:grid-cols-2">
        <Field label="Key locations / facilities">
          <textarea
            className={inputStyles}
            rows={5}
            placeholder="EOC, ICP, staging areas, shelters, hospitals, schools, public works yard, volunteer reception center, communications sites."
          />
        </Field>
        <Field label="Affected infrastructure / routes">
          <textarea
            className={inputStyles}
            rows={5}
            placeholder="Damaged roads, bridges, power substations, water systems, flooded areas, evacuation routes, access control points."
          />
        </Field>
        <Field label="Decision or coordination points">
          <textarea
            className={inputStyles}
            rows={5}
            placeholder="Locations or moments that require leadership decisions, resource prioritization, public warning, evacuation, sheltering, or mutual aid."
          />
        </Field>
        <Field label="Known lanes / operating areas">
          <textarea
            className={inputStyles}
            rows={5}
            placeholder="Add operating lanes, branches, divisions, or geographic work areas."
            defaultValue={lanes.join("\n")}
          />
        </Field>
      </section>
    </div>
  );
}
