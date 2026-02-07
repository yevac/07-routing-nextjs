"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import css from "./NotePreview.module.css";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";

const NotePreviewClient = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: note, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (error) {
    throw error;
  }

  if (!note) return null;

  const formattedDate = note.updatedAt
    ? `Updated at: ${new Date(note.updatedAt).toLocaleDateString()}`
    : `Created at: ${new Date(note.createdAt).toLocaleDateString()}`;

  return (
    <Modal onClose={() => router.back()}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
            <p className={css.tag}>{note.tag}</p>
          </div>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{formattedDate}</p>
        </div>

        <button
          type="button"
          className={css.backBtn}
          onClick={() => router.back()}
        >
          Back
        </button>
      </div>
    </Modal>
  );
};

export default NotePreviewClient;