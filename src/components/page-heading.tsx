export function PageHeading({
  title,
  description,
  detail,
}: {
  title: string;
  description?: string;
  detail?: string;
}) {
  return (
    <header className="mb-8 sm:mb-10">
      <h1
        className="text-4xl font-semibold tracking-tight sm:text-[2.625rem]"
        data-pagefind-meta="title"
      >
        {title}
      </h1>
      {description && (
        <p
          className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed"
          data-pagefind-meta="summary"
        >
          {description}
        </p>
      )}
      {detail && (
        <p className="text-muted-foreground mt-3 text-sm" data-pagefind-ignore>
          {detail}
        </p>
      )}
    </header>
  );
}
