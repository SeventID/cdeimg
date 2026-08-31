import { motion } from "framer-motion";
import { ArrowRight, Terminal, Link2, Zap } from "lucide-react";
import { Link } from "react-router";

const features = [
  {
    icon: Terminal,
    title: "Drag. Upload. Done.",
    description:
      "Drop an image, get an instant link. No friction, no bloat.",
  },
  {
    icon: Link2,
    title: "Markdown-Ready Links",
    description:
      "Copy a raw URL for wget or a GitHub-flavored markdown embed. Paste and go.",
  },
  {
    icon: Zap,
    title: "Instant Delivery",
    description:
      "Files are served from the edge. Your images load fast, everywhere.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-mono">
      {/* ── Nav ── */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-sm uppercase">
            <span className="text-accent">$</span>
            <span>codeimg</span>
          </div>
          <Link
            to="/auth"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            sign in →
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Terminal prompt */}
          <div className="mb-6 text-xs text-muted-foreground">
            <span className="text-primary">$</span>{" "}
            <span className="text-accent">codeimg</span>{" "}
            <span className="text-muted-foreground">--about</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
            Convert images
            <br />
            <span className="text-primary">into links.</span>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Upload an image. Get a shareable URL you can drop into a terminal,
            a GitHub README, or any markdown document. Built for developers who
            move fast.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 rounded border border-primary bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/20"
            >
              Get Started
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded border border-border px-5 py-2.5 text-sm text-muted-foreground transition hover:border-muted-foreground hover:text-foreground"
            >
              Features
            </a>
          </div>
        </motion.div>

        {/* ── Mock terminal ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-16 rounded border border-border bg-card overflow-hidden"
        >
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-destructive/60" />
            <span className="size-2.5 rounded-full bg-accent/60" />
            <span className="size-2.5 rounded-full bg-primary/60" />
            <span className="ml-3 text-[11px] text-muted-foreground">
              codeimg — upload workflow
            </span>
          </div>
          <div className="p-5 text-xs leading-6 space-y-1">
            <p>
              <span className="text-primary">$</span> codeimg upload
              screenshot.png
            </p>
            <p className="text-muted-foreground">
              ▸ Analyzing file... done.
            </p>
            <p className="text-muted-foreground">
              ▸ Uploading to edge storage... done.
            </p>
            <p className="text-primary">
              ✔ https://codeimg.dev/f/a3x8k1.png
            </p>
            <p className="mt-2 text-muted-foreground"># GitHub markdown:</p>
            <p className="text-accent">
              ![](https://codeimg.dev/f/a3x8k1.png)
            </p>
            <p className="mt-2 text-muted-foreground"># wget:</p>
            <p className="text-accent">
              wget https://codeimg.dev/f/a3x8k1.png
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="mb-10 text-xs text-muted-foreground">
            <span className="text-primary">$</span>{" "}
            <span className="text-accent">codeimg</span>{" "}
            <span className="text-muted-foreground">--features</span>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.1 }}
                className="rounded border border-border bg-card p-6"
              >
                <div className="mb-4 flex size-9 items-center justify-center rounded border border-border text-primary">
                  <f.icon className="size-4" />
                </div>
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <p className="text-xs text-muted-foreground mb-4">
            <span className="text-primary">$</span> echo "Ready to upload?"
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded border border-primary bg-primary/10 px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary/20"
          >
            Open CodeImg
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-6 text-center text-[11px] text-muted-foreground">
          codeimg — image to link, for developers.
        </div>
      </footer>
    </div>
  );
}
