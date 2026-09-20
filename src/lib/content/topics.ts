import { allTopics } from "content-collections";
import {
  getPostModifiedAt,
  type Post,
  sortedBlogPosts,
} from "@/lib/content/blog";
import { absoluteUrl, siteConfig } from "@/lib/site/config";

export type Topic = Omit<(typeof allTopics)[number], "_meta">;

export type TopicWithPosts = Topic & {
  posts: Post[];
};

export type TopicGroup = {
  initial: string;
  topics: TopicWithPosts[];
};

const topicNameCollator = new Intl.Collator(siteConfig.language);

function createTopicsWithPosts() {
  const postsByTopicSlug = new Map<string, Post[]>();

  for (const post of sortedBlogPosts) {
    for (const topicSlug of post.topics) {
      const posts = postsByTopicSlug.get(topicSlug);

      if (posts) {
        posts.push(post);
      } else {
        postsByTopicSlug.set(topicSlug, [post]);
      }
    }
  }

  return [...allTopics]
    .sort((left, right) => topicNameCollator.compare(left.name, right.name))
    .map(({ _meta, ...topic }) => ({
      ...topic,
      posts: postsByTopicSlug.get(topic.slug) ?? [],
    }));
}

function createTopicGroups(topics: TopicWithPosts[]) {
  const groups: TopicGroup[] = [];

  for (const topic of topics) {
    const initial =
      Array.from(topic.name.trim())
        .at(0)
        ?.toLocaleUpperCase(siteConfig.language) ?? "#";
    const currentGroup = groups.at(-1);

    if (currentGroup?.initial === initial) {
      currentGroup.topics.push(topic);
    } else {
      groups.push({ initial, topics: [topic] });
    }
  }

  return groups;
}

export const topicsWithPosts: TopicWithPosts[] = createTopicsWithPosts();

const topicsBySlug = new Map(
  topicsWithPosts.map((topic) => [topic.slug, topic]),
);

export const topicGroups = createTopicGroups(topicsWithPosts);

export function getTopicBySlug(slug: string) {
  return topicsBySlug.get(slug);
}

export function getTopicPath(topic: Pick<Topic, "slug">) {
  return `/topics/${topic.slug}`;
}

export function getTopicUrl(topic: Pick<Topic, "slug">) {
  return absoluteUrl(getTopicPath(topic));
}

export function getTopicsModifiedAt() {
  const latestPost = sortedBlogPosts.at(0);

  return latestPost ? getPostModifiedAt(latestPost) : undefined;
}
