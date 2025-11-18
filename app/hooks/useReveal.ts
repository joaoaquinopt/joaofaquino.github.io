"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

export function useReveal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  return { ref, isInView };
}
