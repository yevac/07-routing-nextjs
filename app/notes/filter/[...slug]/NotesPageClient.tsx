"use client";

import css from "@/app/notes/filter/[...slug]/NotesPage.module.css";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getNotes } from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import type { NoteTag } from "@/types/note";

interface NotesPageClientProps {
  tag?: NoteTag;
}

const PER_PAGE = 12;

export default function NotesPageClient({ tag }: NotesPageClientProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["notes", { page, perPage: PER_PAGE, tag, search: debouncedSearch }],
    queryFn: () => getNotes({ page, perPage: PER_PAGE, tag, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !data) return <p>Something went wrong.</p>;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox
          value={search}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />

        {data.totalPages > 1 && (
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        )}

        <button type="button" className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </div>

      {data.notes.length > 0 ? <NoteList notes={data.notes} /> : <p>No notes found.</p>}

      {isModalOpen && (
        <Modal closeModal={() => setIsModalOpen(false)}>
          <NoteForm
            closeModal={() => setIsModalOpen(false)}
            onCreated={() => {
              setPage(1);
              refetch();
            }}
          />
        </Modal>
      )}
    </div>
  );
}