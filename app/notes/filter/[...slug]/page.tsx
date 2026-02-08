import TAGS from "@/constants/noteTags";
import { notFound } from "next/navigation";
import type { NoteTag } from "@/types/note";

import NotesPageClient from "./NotesPageClient";

import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getNotes } from "@/lib/api";

interface NotesByCategoryParams {
  slug: string[];
}

function isNoteTag(value: string): value is NoteTag {
  return TAGS.includes(value as NoteTag);
}

const PER_PAGE = 12;

export default async function NotesByCategory({
  params,
}: {
  params: Promise<NotesByCategoryParams>;
}) {
  const { slug } = await params;
  const filter = slug?.[0] ?? "all";

  let tag: NoteTag | undefined;

  if (filter === "all") {
    tag = undefined;
  } else if (isNoteTag(filter)) {
    tag = filter;
  } else {
    notFound();
  }

  const queryClient = new QueryClient();

  const queryParams = {
    page: 1,
    perPage: PER_PAGE,
    search: "",
    tag,
  };

  await queryClient.prefetchQuery({
    queryKey: ["notes", queryParams],
    queryFn: () => getNotes(queryParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesPageClient tag={tag} />
    </HydrationBoundary>
  );
}
