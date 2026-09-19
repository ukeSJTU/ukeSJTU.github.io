/* biome-ignore-all lint/security/noDangerouslySetInnerHtml: JSON-LD requires a script element and '<' is escaped to prevent HTML injection. */

type JsonLdProps = {
  data: Record<string, unknown>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
      type="application/ld+json"
    />
  );
}
