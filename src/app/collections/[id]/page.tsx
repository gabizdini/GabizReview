import { CollectionDetail } from "./collection-detail";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <article className="mx-auto max-w-4xl">
      <CollectionDetail id={id} />
    </article>
  );
}
