import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { Relic } from "@/types/Relic";
import Scoper from "../Scoper";
import css from "./RelicSearchBar.css?raw";

export function RelicSearchBar() {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isClickingSuggestion, setIsClickingSuggestion] = useState(false);
  const navigate = useNavigate({ from: "/posts" });

  useEffect(() => {
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
  }, [searchInput]);

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

  return (
    <>
      <Scoper style={css} />
      <div className="relic-search">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            if (!isClickingSuggestion) {
              setIsOpen(false);
            }
          }}
          placeholder="Search relics..."
        />
        {suggestions.length > 0 && isOpen && (
          <ul className="relic-suggestions">
            {suggestions.map((suggestion) => (
              <li key={suggestion} className="relic-suggestion">
                <button
                  type="button"
                  onMouseDown={() => setIsClickingSuggestion(true)}
                  onMouseUp={() => setIsClickingSuggestion(false)}
                  onClick={() => handleSubmit(suggestion)}
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
