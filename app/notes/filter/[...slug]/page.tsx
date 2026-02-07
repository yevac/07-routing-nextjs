import NotesPageClient from "./NotesPageClient";

type Props = {
  params: { slug?: string[] };
};

export default function FilteredNotesPage({ params }: Props) {
  const tag = params.slug?.[0];
  const normalizedTag = tag === "all" ? undefined : tag;

  return <NotesPageClient tag={normalizedTag} />;
}
