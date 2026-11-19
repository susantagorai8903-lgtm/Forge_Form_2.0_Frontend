"use client";

import { useMemo, useState } from "react";
import type { Program, ProgramCategory } from "@/types/content";
import { ProgramCard } from "@/components/shared/ProgramCard";
import { ContentNotice } from "@/components/shared/ContentNotice";

export function ProgramBrowser({ programs, categories }: { programs: Program[]; categories: ProgramCategory[] }) {
  const [category, setCategory] = useState("All");
  const filtered = useMemo(
    () => programs.filter((program) => category === "All" || program.eyebrow === category),
    [programs, category],
  );

  return (
    <>
      <div className="filter-list" aria-label="Filter programs by category">
        {["All", ...categories.map((item) => item.name)].map((item) => (
          <button
            className="filter-button"
            type="button"
            aria-pressed={category === item}
            key={item}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      {filtered.length > 0 ? (
        <div className="program-grid" style={{ marginTop: 42 }}>
          {filtered.map((program, index) => <ProgramCard program={program} index={index} key={program.slug} />)}
        </div>
      ) : (
        <ContentNotice message="No programs are currently available in this category." />
      )}
    </>
  );
}
