import type { Post } from "@/types/Post";
import { minutesSince } from "@/utils/minutesSince";
import { useRef, useState, useEffect } from "react";

export default function PostRow({
  post,
}: {
  post: Post & {
    tier: string;
    relic_name: string;
    username: string;
  };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const message = `\\w ${post.username} Inv please for ${post.tier} ${post.relic_name} (warframelfg.com)`;
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.select();
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <li className="results-grid__row" key={post.post_id}>
      {isOpen ? (
        <div className="lfg-copy">
          <input
            ref={inputRef}
            type="text"
            translate="no"
            readOnly
            value={message}
            data-post-id={post.post_id}
          />
        </div>
      ) : (
        <>
          <span>{`${post.tier} ${post.relic_name}`}</span>
          <span className="_text-right">{post.open_slots}</span>
          <span className="minutes-since">
            {minutesSince(post.updated_at)} mins ago
          </span>
          <span>{post.username}</span>{" "}
        </>
      )}
      <div>
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setTooltipVisible(!tooltipVisible);
            navigator.clipboard.writeText(message);
          }}
          className="inv-btn"
        >
          {isOpen ? "Close" : "Get Inv."}
        </button>
        {tooltipVisible && (
          <span className="inv-btn__tooltip" data-visible={tooltipVisible}>
            Copied!
          </span>
        )}
      </div>
    </li>
  );
}
