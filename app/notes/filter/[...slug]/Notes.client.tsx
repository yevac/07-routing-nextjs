"use client";

import Link from "next/link";
import css from "./Notes.module.css";
import { Note } from "@/types/note";

type Props = {
  notes: Note[];
};

export default function Notes({ notes }: Props) {
  if (notes.length === 0) {
    return <p className={css.empty}>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map(note => (
        <li key={note.id} className={css.item}>
          <Link href={`/notes/${note.id}`} className={css.link}>
            <h3 className={css.title}>{note.title}</h3>
            <p className={css.content}>{note.content}</p>
            <span className={css.tag}>{note.tag}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
