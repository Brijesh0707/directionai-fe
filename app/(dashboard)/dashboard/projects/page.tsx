"use client";

import React, { useEffect, useState } from "react";
import {
  Folder,
  Search,
  Clock3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import SideBarDashboardWrapper from "@/providers/SideBarDashboardWrapper";
import { chatService } from "@/services/chat.service";
import { ChatSessionSummary } from "@/types/chat";

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
  const [projects, setProjects] = useState<ChatSessionSummary[]>([]);
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
        const data = await chatService.listSessionSummaries({
          page: 1,
          limit: 100,
          search: debouncedSearch || undefined,
        });
        setProjects(data.items);
      } catch (error) {
        console.error("Failed to load projects", error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    void loadProjects();
  }, [debouncedSearch]);

  return (
    <SideBarDashboardWrapper>
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Projects
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage your workspace initiatives and strategic roadmaps.
            </p>
          </div>
        </div>

        {/* Search */}
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

        {/* Projects Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-card p-5 animate-pulse"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gray-200" />
                  <div className="mt-5 space-y-2">
                    <div className="h-4 rounded bg-gray-200 w-3/4" />
                    <div className="h-3 rounded bg-gray-100 w-full" />
                  </div>
                  <div className="mt-6 h-3 rounded bg-gray-100 w-1/2" />
                </div>
              ))
            : projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => router.push(`/dashboard/projects/${project.id}`)}
                  className="text-left rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-sm"
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-100 text-primary">
                    <Folder size={20} />
                  </div>
                  <div className="mt-5">
                    <h3 className="text-lg font-semibold text-foreground leading-none truncate">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock3 size={12} />
                    Updated {formatTimestamp(project.createdAt)}
                  </div>
                </button>
              ))}
          {!loading && projects.length === 0 && (
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
