import Link from "next/link";
import { getTopicPath, type TopicGroup } from "@/lib/content/topics";

export function TopicIndex({ groups }: { groups: TopicGroup[] }) {
  return (
    <nav aria-label="Topics by initial" className="border-border border-t">
      {groups.map((group) => {
        const headingId = `topics-${group.initial.toLocaleLowerCase()}`;

        return (
          <section
            aria-labelledby={headingId}
            className="border-border border-b py-5 sm:grid sm:grid-cols-[5rem_minmax(0,1fr)] sm:gap-6 sm:py-6"
            key={group.initial}
          >
            <h2
              className="text-muted-foreground text-3xl font-semibold sm:text-4xl"
              id={headingId}
            >
              {group.initial}
            </h2>

            <ul className="mt-3 flex flex-col sm:mt-0">
              {group.topics.map((topic) => (
                <li key={topic.slug}>
                  <Link
                    className="group -mx-3 flex items-baseline justify-between gap-6 rounded-md px-3 py-3 hover:bg-muted"
                    href={getTopicPath(topic)}
                    transitionTypes={["nav-forward"]}
                  >
                    <span className="text-xl font-semibold underline-offset-4 group-hover:underline">
                      {topic.name}
                    </span>
                    <span className="text-muted-foreground shrink-0 text-sm tabular-nums">
                      {[
                        topic.posts.length,
                        topic.posts.length === 1 ? "note" : "notes",
                      ].join(" ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </nav>
  );
}
