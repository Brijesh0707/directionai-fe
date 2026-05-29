"use client";

import React, { useEffect, useState } from "react";
import { Clock3, Folder, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import SideBarDashboardWrapper from "@/providers/SideBarDashboardWrapper";
import { chatService } from "@/services/chat.service";
import { ChatSession } from "@/types/chat";

const formatTimestamp = (isoDate: string) => {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString();
};

const Projects = () => {
  const [projects, setProjects] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const sessions = await chatService.listSessions();
        setProjects(sessions);
      } catch (error) {
        console.error("Failed to load projects", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    void loadProjects();
  }, [debouncedSearch]);

  const visibleProjects = projects.filter((project) => {
    if (!debouncedSearch) return true;
    const haystack = `${project.title} ${project.idea} ${project.projectCategory ?? ""}`.toLowerCase();
    return haystack.includes(debouncedSearch.toLowerCase());
  });

  return (
    <SideBarDashboardWrapper>
      <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Projects</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your workspace initiatives and strategic roadmaps.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
              {loading ? "Loading projects..." : `${visibleProjects.length} projects visible`}
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="text"
                placeholder="Search projects"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-12 w-full rounded-2xl border border-border bg-card pl-11 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-[28px] border border-border bg-card p-5 shadow-sm animate-pulse"
                  >
                    <div className="absolute left-5 top-0 h-3 w-16 rounded-b-xl bg-indigo-100" />
                    <div className="flex items-start gap-4 pt-2">
                      <div className="relative h-14 w-14 rounded-2xl bg-gray-200" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-4 rounded bg-gray-200 w-3/4" />
                        <div className="h-3 rounded bg-gray-100 w-full" />
                        <div className="h-3 rounded bg-gray-100 w-5/6" />
                      </div>
                    </div>
                  </div>
                ))
              : visibleProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                    className="group relative overflow-hidden rounded-[28px] border border-border bg-card p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg"
                  >
                    <div className="absolute left-5 top-0 h-3 w-16 rounded-b-xl bg-gradient-to-r from-[#0B04CF]/20 to-[#1208E8]/10" />
                    <div className="absolute right-4 top-4 rounded-full border border-border bg-background/80 px-2 py-1 text-[10px] font-semibold text-muted-foreground">
                      Folder
                    </div>

                    <div className="flex items-start gap-4 pt-3">
                      <div className="relative shrink-0">
                        <div className="absolute -inset-1 rounded-[22px] bg-indigo-500/10 blur-md opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                        <div className="relative h-14 w-14 rounded-[18px] bg-gradient-to-br from-[#0B04CF]/10 via-[#1208E8]/10 to-[#6B66F5]/10 text-primary flex items-center justify-center border border-primary/10">
                          <Folder size={24} />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-foreground leading-tight truncate">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-xs leading-5 text-muted-foreground line-clamp-3">
                          {project.idea}
                        </p>

                        <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
                          <Clock3 size={12} />
                          <span>Updated {formatTimestamp(project.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            {!loading && visibleProjects.length === 0 && (
              <div className="col-span-full rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                No projects found.
              </div>
            )}
          </div>
      </div>
    </div>
    </SideBarDashboardWrapper>
  );
};

export default Projects;
