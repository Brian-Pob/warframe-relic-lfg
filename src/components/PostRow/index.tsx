import type { PostUI } from "@/types/Post";
import { minutesSince } from "@/utils/minutesSince";
import { useRef, useState, useEffect, memo } from "react";
import Scoper from "../Scoper";
import css from "./PostRow.css?raw";

function PostRow_({
  post,
}: {
  post: PostUI;
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
      <Scoper style={css} />
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
          <span>
            <p>{`${post.tier} ${post.relic_name}`}</p>
          </span>
          <span>
            <p>{post.refinement}</p>
          </span>
          <span className="_justify-right">
            <p className="_text-right">{post.open_slots}</p>
          </span>
          <span>
            <p>{post.username}</p>
          </span>
          <span>
            <p>{minutesSince(post.updated_at)} mins ago</p>
          </span>
        </>
      )}
      <div className="_justify-right">
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
          {tooltipVisible && (
            <span className="inv-btn__tooltip" data-visible={tooltipVisible}>
              Copied!
            </span>
          )}
        </button>
      </div>
    </li>
  );
}

export const PostRow = memo(PostRow_);
