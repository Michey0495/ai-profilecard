"use client";

import { useEffect } from "react";
import { saveToHistory } from "./CardHistory";

interface Props {
  id: string;
  name: string;
  title: string;
  style: string;
  createdAt: string;
}

export function SaveHistory({ id, name, title, style, createdAt }: Props) {
  useEffect(() => {
    saveToHistory({ id, name, title, style, createdAt });
  }, [id, name, title, style, createdAt]);

  return null;
}
