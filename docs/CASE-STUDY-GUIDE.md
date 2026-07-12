# Case-study guide

Case-study tabs are generated from `src/lib/tabs.ts`: each primary category
has its own tab template, and a tab only renders if at least one of its
sections has content. You never declare tabs by hand — you fill fields.

## Which fields feed which tabs

**Every category** starts with **Overview**: `summary` (required),
`introduction`, `caseStudy.problem`, `caseStudy.importance`,
`caseStudy.constraints`, `links`, plus tags and related work.

| Category         | Tabs (field → tab)                                                                                                                                                     |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AI & Engineering | `architecture` → Architecture · `process`/`decisions`/`tools` → Development · `results` → Results · `failures`/`learnings`/`nextSteps` → Learnings · gallery → Gallery |
| Research         | `methodology` → Methodology · `process`/`tools` → Process · `results` → Findings · `nextSteps`/`learnings` → Next Steps · gallery → Evidence                           |
| Marketing        | `strategy` → Strategy · `process`/`decisions`/`tools` → Content · `results` → Results · gallery → Images · `failures`/`learnings` → Learnings                          |
| Product & UI/UX  | gallery (ui/mobile) → Screens · `process` → User Journey · `decisions`/`tools` → Design Process · `architecture` → Build · `results`/`learnings` → Outcome             |
| Business         | `process` → Workflow · `architecture`/`tools` → System · `strategy`/`decisions` → Analysis · `results`/`learnings` → Outcome · gallery → Gallery                       |
| Games & Play     | `gameplay` → Gameplay · gallery → Gallery · `process`/`decisions`/`tools` → Development · `failures`/`constraints` → Challenges · `learnings` → Learnings              |
| Social Impact    | `methodology`/`strategy` → Approach · `process`/`decisions`/`tools` → Development · `results` → Results · `learnings` → Learnings · gallery → Gallery                  |

## Writing rules

- **Results are sacred.** Only verified facts go into `results`. Use the
  optional `detail` field for attribution (e.g. “As reported by the
  portfolio owner”).
- **Unknowns are labelled**, never invented: “Details being added”,
  “Case study in progress”.
- Keep `cardLine` under 90 characters — it's the one line on the collapsed
  note card.
- Playful microcopy belongs in the interface, not inside research or
  technical case-study text.

## Changing a template

Edit `tabTemplates` in `src/lib/tabs.ts`. Tabs are
`{ id, label, sections }`; sections are content keys from `SectionKey`.
The renderer for each section lives in
`src/components/case-study/CaseStudyContent.tsx`.
