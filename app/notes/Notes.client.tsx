"use client";

import { useEffect, useState } from "react";
import css from "./Notes.module.css";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getNotes } from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";

export default function NotesClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", currentPage, debouncedSearch],
    queryFn: () => getNotes(currentPage, debouncedSearch),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onSearch={setSearch} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            page={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <button onClick={() => setIsModalOpen(true)} className={css.button}>
          Create note +
        </button>
      </header>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm closeModal={() => setIsModalOpen(false)} />
        </Modal>
      )}

      {notes.length > 0 ? <NoteList notes={notes} /> : <p>No notes</p>}
    </div>
  );
}
