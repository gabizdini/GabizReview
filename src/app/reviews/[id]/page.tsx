import { ReviewDetail } from "./review-detail";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <article className="mx-auto max-w-2xl">
      <ReviewDetail id={id} />
    </article>
  );
}
