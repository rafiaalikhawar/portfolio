"use client";

/** The informational notes: About, Contact, Resume, and Tiny Experiments. */
import { about, contact, tinyExperiments } from "@/content/profile";
import { socialLinks, getSocialLink } from "@/config/socialLinks";
import { currentlyBuildingProjects } from "@/content/project-index";
import { useWindowStore } from "@/stores/windowStore";
import { Nimbus } from "@/components/ui/Nimbus";

function NoteShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto h-full w-full max-w-2xl overflow-y-auto px-6 py-8">
      <article className="panel relative px-7 py-7 sm:px-9">
        {/* washi tape */}
        <span
          aria-hidden
          className="absolute -top-2 left-1/2 h-5 w-24 -translate-x-1/2 rotate-[-2deg] rounded-sm opacity-70"
          style={{ background: "var(--pink)", boxShadow: "var(--shadow-soft)" }}
        />
        <h1 className="mb-4 font-serif text-2xl font-semibold text-ink">{title}</h1>
        {children}
      </article>
    </div>
  );
}

function LinkRow() {
  return (
    <div className="flex flex-wrap gap-2">
      {socialLinks
        .filter((l) => l.id !== "domain")
        .map((link) =>
          link.url ? (
            <a
              key={link.id}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="rounded-full border border-line bg-surface-3 px-3.5 py-1.5 text-xs font-bold text-ink transition-colors hover:bg-sky"
            >
              <span aria-hidden>{link.icon} </span>
              {link.label}
            </a>
          ) : (
            <span
              key={link.id}
              className="rounded-full border border-dashed border-line px-3.5 py-1.5 text-xs text-muted/70"
              title={link.placeholderHint}
            >
              <span aria-hidden>{link.icon} </span>
              {link.label} <span className="italic">· soon</span>
            </span>
          ),
        )}
    </div>
  );
}

export function AboutNote() {
  const openWindow = useWindowStore((s) => s.openWindow);
  return (
    <NoteShell title="About Rafia ♡">
      {about.intro.map((p) => (
        <p key={p.slice(0, 24)} className="mb-3 text-sm leading-relaxed text-muted">
          {p}
        </p>
      ))}
      <div className="mt-6 space-y-5">
        {about.sections.map((s) => (
          <section key={s.id}>
            <h2 className="mb-1 font-serif text-[15px] font-semibold text-ink">
              {s.title}
            </h2>
            <p className="text-[13px] leading-relaxed text-muted">{s.body}</p>
            {s.id === "building" && (
              <div className="mt-2 flex flex-wrap gap-2">
                {currentlyBuildingProjects().map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => openWindow(p.id)}
                    className="cursor-pointer rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-semibold text-ink hover:bg-pink"
                  >
                    <span aria-hidden>{p.icon} </span>
                    {p.shortTitle ?? p.title} ↗
                  </button>
                ))}
              </div>
            )}
          </section>
        ))}
        <section>
          <h2 className="mb-2 font-serif text-[15px] font-semibold text-ink">
            Resume & contact
          </h2>
          <LinkRow />
        </section>
      </div>
    </NoteShell>
  );
}

export function ContactNote() {
  return (
    <NoteShell title={contact.heading}>
      <p className="mb-1 font-mono text-[11px] italic text-muted">
        {contact.microcopy}
      </p>
      <p className="mb-5 text-sm leading-relaxed text-muted">{contact.body}</p>
      <LinkRow />
      <div className="mt-8 flex justify-center">
        <Nimbus size={64} />
      </div>
    </NoteShell>
  );
}

export function ResumeNote() {
  const resume = getSocialLink("resume");
  return (
    <NoteShell title="Resume">
      <p className="mb-5 text-sm leading-relaxed text-muted">
        The full resume covers the engineering, research, product, and marketing work in
        one page.
      </p>
      {resume.url ? (
        <a
          href={resume.url}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-full border border-line-strong bg-cream px-5 py-2.5 text-sm font-bold text-ink shadow-sm transition-transform hover:scale-[1.02]"
        >
          📄 Open Rafia-Ali-Resume.pdf ↗
        </a>
      ) : (
        <p className="text-sm italic text-muted">Resume link being added.</p>
      )}
      <p className="mt-4 font-mono text-[10.5px] text-muted/70">
        Note: the current PDF is a placeholder file — replace
        public/Rafia-Ali-Resume.pdf with the real resume.
      </p>
    </NoteShell>
  );
}

export function ExperimentsNote() {
  return (
    <NoteShell title={tinyExperiments.heading}>
      <p className="mb-1 font-mono text-[11px] italic text-muted">
        {tinyExperiments.microcopy}
      </p>
      <p className="text-sm leading-relaxed text-muted">{tinyExperiments.body}</p>
      <div className="mt-8 flex justify-center">
        <Nimbus variant="glasses" size={64} />
      </div>
    </NoteShell>
  );
}
