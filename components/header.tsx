"use client";

import type { JSX } from "react";
import React, { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Bell, Menu, Mic, Search, Upload, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setSearchQuery } from "@/redux/features/videoSlice";

/**
 *
 * @param root0
 * @param root0.setExpanded
 */
export default function Header({
  setExpanded,
}: {
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(query));
  };

  const handleSidebar = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:mr-2"
          onClick={handleSidebar}
        >
          <Menu className="size-5" />
          <span className="sr-only">Menu</span>
        </Button>
        <Link href="/" className="flex items-center gap-1">
          <svg
            className="size-6 text-red-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
          </svg>
          <span className="hidden text-lg font-semibold md:inline">
            YouTube
          </span>
        </Link>
      </div>
      <form onSubmit={handleSearch} className="mx-4 max-w-xl flex-1">
        <div className="flex">
          <Input
            type="search"
            placeholder="Search"
            className="rounded-r-none border-r-0"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="submit"
            variant="outline"
            size="icon"
            className="rounded-l-none"
          >
            <Search className="size-4" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="ghost" size="icon" className="ml-2 hidden md:flex">
            <Mic className="size-5" />
            <span className="sr-only">Voice search</span>
          </Button>
        </div>
      </form>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Upload className="size-5" />
          <span className="sr-only">Upload</span>
        </Button>
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Bell className="size-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Button variant="ghost" size="icon">
          <User className="size-5" />
          <span className="sr-only">Account</span>
        </Button>
      </div>
    </header>
  );
}
