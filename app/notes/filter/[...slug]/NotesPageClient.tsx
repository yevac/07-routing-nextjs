"use client";

import { useQuery } from "@tanstack/react-query";
import css from "./NotesPage.module.css";
import { getNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";

type Props = {
  tag?: string;
};

export default function NotesPageClient({ tag }: Props) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", tag],
    queryFn: () => getNotes(1, "", tag),
  });

  if (isLoading) return <p>Loading notes...</p>;
  if (error || !data) return <p>Failed to load notes.</p>;

  return (
    <div className={css.wrapper}>
      <NoteList notes={data.notes} />
    </div>
  );
}

