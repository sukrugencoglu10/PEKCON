/**
 * JsonLd — Reusable JSON-LD structured data component
 * Renders a <script type="application/ld+json"> tag for Schema.org markup.
 * Usage: <JsonLd data={schemaObject} />
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
