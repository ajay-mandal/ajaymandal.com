"use client";

import { useEffect } from "react";

/** Adds a "copy" button to every rendered code block's header inside `selector`. */
export default function CopyCodeButtons({ selector }: { selector: string }) {
  useEffect(() => {
    const root = document.querySelector(selector);
    if (!root) return;
    const added: HTMLButtonElement[] = [];
    root.querySelectorAll<HTMLElement>(".code-block").forEach((block) => {
      const head = block.querySelector(".code-head");
      const code = block.querySelector("pre");
      if (!head || !code || head.querySelector(".copy-btn")) return;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "copy-btn";
      button.textContent = "copy";
      button.setAttribute("aria-label", block.dataset.lang ? `Copy ${block.dataset.lang} code` : "Copy code");
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(code.innerText);
          button.textContent = "copied";
        } catch {
          button.textContent = "press ⌘C";
        }
        setTimeout(() => (button.textContent = "copy"), 1600);
      });
      head.appendChild(button);
      added.push(button);
    });
    return () => added.forEach((b) => b.remove());
  }, [selector]);

  return null;
}
