import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Relic } from "@/types/Relic";
import Scoper from "../Scoper";
import css from "./RelicSearchBar.css?raw";
import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/posts/");

export default function RelicSearchBar() {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isClickingSuggestion, setIsClickingSuggestion] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate({ from: "/posts" });
  const { relic } = routeApi.useSearch();

  useEffect(() => {
    setSearchInput(relic.replace("_", " "));

    if (searchInput.length < 2) {
      setSuggestions([]);
      return;
    }

    const localRelics = localStorage.getItem("relics");
    if (!localRelics) return;

    const relics = JSON.parse(localRelics) as Relic[];
    const filteredRelics = relics
      .filter((relic) => relic.refinement === "Intact")
      .filter((relic) =>
        `${relic.tier} ${relic.relic_name}`
          .toLowerCase()
          .includes(searchInput.toLowerCase()),
      )
      .map((relic) => `${relic.tier} ${relic.relic_name}`);

    setSuggestions(filteredRelics.slice(0, 5));
  }, [searchInput, relic]);

  const handleSubmit = (suggestion: string) => {
    const [tier, name] = suggestion.split(" ");
    navigate({
      to: "/posts",
      search: { relic: `${tier}_${name}` },
    });
    setSearchInput("");
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSubmit(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <>
      <Scoper style={css} />
      <div className="relic-search">
        <div className="relic-search-input-container">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setIsOpen(true);
              navigate({
                to: "/posts",
                search: { relic: e.target.value.replace(" ", "_") },
              });
              setSearchInput(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              if (!isClickingSuggestion) {
                setIsOpen(false);
                setSelectedIndex(-1);
              }
            }}
            placeholder="Search relics..."
          />
          <button
            type="button"
            onClick={() => {
              navigate({
                to: "/posts",
                search: { relic: "" },
              });
              setSearchInput("");
            }}
          >
            Clear
          </button>
        </div>
        {suggestions.length > 0 && isOpen && (
          <ul className="relic-suggestions">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                className={`relic-suggestion ${index === selectedIndex ? "selected" : ""}`}
              >
                <button
                  type="button"
                  onMouseDown={() => setIsClickingSuggestion(true)}
                  onMouseUp={() => setIsClickingSuggestion(false)}
                  onClick={() => handleSubmit(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
