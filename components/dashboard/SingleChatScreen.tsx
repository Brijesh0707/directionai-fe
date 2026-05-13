"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { MockProject, readMockProjects } from "@/lib/mockProjects";

const SingleChatScreen = ({ chatId }: { chatId: string }) => {
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<MockProject | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const projects = readMockProjects();
      const found = projects.find((item) => item.id === chatId) ?? null;
      setProject(found);
      setLoading(false);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [chatId]);

  return (
    <section className="min-h-full">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft size={16} />
        Back to New Project
      </Link>

      <div className="mt-5 rounded-[28px] border border-border bg-card/80 p-6 sm:p-8">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-24 rounded bg-border" />
            <div className="h-9 w-3/4 rounded bg-border" />
            <div className="h-20 w-full rounded-2xl bg-border" />
            <div className="h-20 w-4/5 rounded-2xl bg-border" />
          </div>
        ) : project ? (
          <>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <Sparkles size={14} />
              Chat ID: {project.id}
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-foreground">{project.title}</h1>
            <p className="mt-3 text-muted-foreground leading-8">
              {project.idea}
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-border bg-background p-4">
                <p className="text-sm font-semibold text-muted-foreground">System</p>
                <p className="mt-2 text-foreground">
                  Mock chat screen loaded. This is frontend-only routing and local project state.
                </p>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-sm font-semibold text-primary">Direction AI</p>
                <p className="mt-2 text-foreground">
                  Starting your plan for &quot;{project.title}&quot;.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-foreground">Project not found</h2>
            <p className="mt-2 text-muted-foreground">
              This chat id does not exist in local mock projects.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SingleChatScreen;
