"use client";

import { useState } from "react";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import VideoGrid from "@/components/video-grid";
import { Providers } from "@/redux/provider";

/**
 *
 */
export default function Home() {
  const [expanded, setExpanded] = useState(true);
  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <Header setExpanded={setExpanded} />
        <div className="flex">
          <Sidebar expanded={expanded} />
          <main className="flex-1 p-4 md:p-6">
            <h2 className="mb-4 text-xl font-semibold">Recommended</h2>
            <VideoGrid />
          </main>
        </div>
      </div>
    </Providers>
  );
}
