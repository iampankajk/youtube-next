"use client";

import type { JSX } from "react";
import React, { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Bell, Menu, Mic, Search, Upload, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setSearchQuery } from "@/redux/features/videoSlice";

export default function Header({
  setExpanded,
}: {
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  // Debounce function
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Simulated API call for search suggestions
  const fetchSearchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const fakeSuggestions = [
      `${query} tutorial`,
      `${query} latest news`,
      `${query} how to`,
      `${query} vs alternative`,
      `best ${query} apps`,
    ];
    setSuggestions(fakeSuggestions);
  };

  const debouncedFetchSuggestions = useCallback(
    debounce((query: string) => {
      fetchSearchSuggestions(query);
    }, 300),
    [],
  );

  useEffect(() => {
    if (query.trim() !== "" && showSuggestions) {
      debouncedFetchSuggestions(query);
    } else {
      setSuggestions([]);
    }
  }, [query, showSuggestions, debouncedFetchSuggestions]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() !== "") {
      dispatch(setSearchQuery(query));
      setShowSuggestions(false); // Hide suggestions on submit
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    dispatch(setSearchQuery(suggestion));
    setShowSuggestions(false); // Hide suggestions after selecting
    setSuggestions([]); // Clear suggestions list
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        handleSuggestionClick(suggestions[activeIndex]);
      } else {
        handleSearchSubmit(e);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside the dropdown/input
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      <form
        onSubmit={handleSearchSubmit}
        className="relative mx-4 max-w-xl flex-1"
      >
        <div className="flex">
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search"
            className="rounded-r-none border-r-0"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
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
        {suggestions.length > 0 && showSuggestions && (
          <ul
            ref={suggestionsRef}
            className="absolute left-0 top-full z-10 w-full rounded-md border bg-white shadow-lg"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 ${
                  index === activeIndex ? "bg-gray-200" : ""
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
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
