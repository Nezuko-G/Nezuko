"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "use-debounce";
import { AnimatePresence, motion } from "framer-motion";

interface SelectWithSearchProps<T> {
  label?: string;
  placeholder?: string;
  noResultsText?: string;
  options: T[];
  value: string;
  onChange: (value: string) => void;
  getOptionValue: (option: T) => string;
  getOptionLabel: (option: T) => string;
  searchFields: ((option: T) => string)[];
  error?: string;
}

export function SelectWithSearch<T>({
  label,
  placeholder = "Search...",
  noResultsText = "No results found",
  options,
  value,
  onChange,
  getOptionValue,
  getOptionLabel,
  searchFields,
  error,
}: SelectWithSearchProps<T>) {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const ignoreNextFocusRef = useRef(false);

  const selected = useMemo(
    () => options.find((opt) => getOptionValue(opt) === value),
    [options, value, getOptionValue]
  );

  const filtered = useMemo(() => {
    if (!debouncedQuery.trim()) return options;
    const q = debouncedQuery.toLowerCase();
    return options.filter((opt) =>
      searchFields.some((fn) => fn(opt).toLowerCase().includes(q))
    );
  }, [options, debouncedQuery, searchFields]);

  const selectedLabel = value && selected ? getOptionLabel(selected) : "";
  const showDropdown = focused && (query.trim().length > 0 || filtered.length > 0) && query !== selectedLabel;

  const open = useCallback(() => {
    if (ignoreNextFocusRef.current) {
      ignoreNextFocusRef.current = false;
      return;
    }
    setQuery(value ? getOptionLabel(selected!) : "");
    setFocused(true);
  }, [value, selected, getOptionLabel]);

  const close = useCallback(() => {
    setFocused(false);
    setActiveIndex(-1);
  }, []);

  const select = useCallback(
    (val: string) => {
      const option = options.find((o) => getOptionValue(o) === val);
      onChange(val);
      setQuery(option ? getOptionLabel(option) : "");
      setActiveIndex(-1);
      setFocused(false);
      inputRef.current?.blur();
    },
    [onChange, options, getOptionValue, getOptionLabel]
  );

  const handleInputChange = useCallback(
    (text: string) => {
      setQuery(text);
      if (value) onChange("");
      setActiveIndex(-1);
    },
    [value, onChange]
  );

  const clear = useCallback(() => {
    setQuery("");
    onChange("");
    setActiveIndex(-1);
    setFocused(true);
    inputRef.current?.focus();
  }, [onChange]);

  useEffect(() => {
    if (!focused) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        inputRef.current?.blur();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      }
      if (e.key === "Enter" && activeIndex >= 0 && activeIndex < filtered.length) {
        e.preventDefault();
        select(getOptionValue(filtered[activeIndex]));
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [focused, filtered, activeIndex, close, select, getOptionValue]);

  useEffect(() => {
    if (focused && listRef.current && activeIndex >= 0) {
      const el = listRef.current.children[activeIndex] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, focused]);

  return (
    <div className="flex flex-col gap-1.5 relative" ref={containerRef}>
      {label && (
        <label className="text-xs font-medium text-gray-600">
          {label} <span className="text-red-400">*</span>
        </label>
      )}

      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={open}
           onBlur={close}
          className={`w-full border rounded-lg pl-9 pr-8 py-2 text-sm outline-none transition-all
            ${error ? "border-red-300 bg-red-50" : "border-gray-200"}
            ${focused ? "ring-2 ring-primary/30 border-primary" : ""}`}
        />
        {(query || value) && (
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              ignoreNextFocusRef.current = true;
            }}
            onClick={clear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 left-0 top-full mt-1 w-[260px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          >
            <div ref={listRef} className="max-h-[200px] overflow-y-auto">
              {filtered.length === 0 && debouncedQuery.trim() ? (
                <div className="px-3 py-4 text-sm text-gray-400 text-center">
                  {noResultsText}
                </div>
              ) : (
                filtered.map((opt, i) => {
                  const val = getOptionValue(opt);
                  const isActive = i === activeIndex;
                  const isSelected = val === value;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => select(val)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors
                        ${isActive ? "bg-primary/5" : ""}
                        ${isSelected ? "font-semibold text-primary" : "text-gray-700"}
                        ${i !== filtered.length - 1 ? "border-b border-gray-50" : ""}`}
                    >
                      {getOptionLabel(opt)}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
