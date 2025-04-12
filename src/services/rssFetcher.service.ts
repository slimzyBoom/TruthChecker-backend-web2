import Parser from "rss-parser";
import { Article } from "../models/source.model";
import { ArticleTypes } from "../types/Article";

const parser: Parser<ArticleTypes> = new Parser();

const cleanText = (text: string): string => {
  return text
    .replace(/\n/g, " ")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#[0-9]+;/g, " ")
    .trim();
};
const rssFeeds = [
  {
    name: "Channels TV",
    url: "https://www.channelstv.com/feed/",
  },
  // {
  //   name: "Dubawa",
  //   url: "https://dubawa.org/feed/",
  // },
  // {
  //   name: "Punch Newspaper",
  //   url: "	https://punchng.com/feed/",
  // },
  // {
  //   name: "Vanguard Newspaper",
  //   url: "https://www.vanguardngr.com/feed/",
  // },
  // {
  //   name: "Sahara Reporters",
  //   url: "https://saharareporters.com/rss.xml",
  // },
  // {
  //   name: "Guardian Newspaper",
  //   url: " https://guardian.ng/category/features/health/feed/",
  // },
];

const categorizeArticle = (
  text: string
): "Health" | "Politics" | "Security" | "Other" => {
  const lower = text.toLowerCase();

  if (
    /(health|covid|malaria|disease|hospital|doctor|ncdc|vaccine|clinic)/.test(
      lower
    )
  )
    return "Health";

  if (
    /(politics|election|government|senate|president|minister|assembly|campaign|vote)/.test(
      lower
    )
  )
    return "Politics";

  if (
    /(security|kidnap|terror|bandit|police|army|military|attack|gunmen|abduction|violence)/.test(
      lower
    )
  )
    return "Security";

  return "Other";
};

export const fetchAndSaveRssArticles = async () => {
  for (const feed of rssFeeds) {
    try {
      const parsed = await parser.parseURL(feed.url);
      for (const item of parsed.items.slice(0, 15)) {
        // Getting the image URL
        let image = null;

        if (item["media:content"] && item["media:content"]["$"]) {
          image = item["media:content"]["$"].url;
        } else if (item.enclosure && item.enclosure.url) {
          image = item.enclosure.url;
        } else if (item.content && item.content.includes("<img")) {
          // fallback: extract from HTML with regex
          const match = item.content.match(/<img.*?src="(.*?)"/);
          image = match ? match[1] : null;
        }

        // Clean Text
        const snippet = cleanText(
          item.contentSnippet || item.content || item.description || ""
        );
        const title = cleanText(item.title || "");

        // Categorize Articles
        const contentCategory = `${title} ${snippet}`;
        const category = categorizeArticle(contentCategory);

        const existing = await Article.findOne({ link: item.link });
        let myArticle = {
          title,
          link: item.link,
          snippet,
          pubDate: new Date(item.pubDate as string) , // Ensure pubDate is a valid Date object
          source: feed.name,
          category,
          image,
        };

        console.log(`My Article: ${JSON.stringify(myArticle)}`);
        if (!existing) {
          await Article.create(myArticle);
        }
      }
    } catch (error) {
      console.error(`Error saving article from ${feed.name}:`, error);
    }
  }
};



// const parser = new Parser({
//   customFetch: fetch,
// });

// // type Article = {
// //   title: string;
// //   link: string;
// //   snippet: string;
// //   pubDate?: string;
// //   source: string;
// // };

// const rssFeeds = [
//   {
//     name: "Channels TV",
//     url: "https://www.channelstv.com/feed/",
//   },
//   // {
//   //   name: "Dubawa",
//   //   url: "https://dubawa.org/feed/",
//   // },
//   // {
//   //   name: "Punch Newspaper",
//   //   url: "	https://punchng.com/feed/",
//   // },
//   // {
//   //   name: "Vanguard Newspaper",
//   //   url: "https://www.vanguardngr.com/feed/",
//   // },
//   // {
//   //   name: "Sahara Reporters",
//   //   url: "https://saharareporters.com/rss.xml",
//   // },
// ];

// const categorizeArticle = (text) => {
//   const lower = text.toLowerCase();

//   if (
//     /(health|covid|malaria|disease|hospital|doctor|ncdc|vaccine|clinic)/.test(
//       lower
//     )
//   )
//     return "Health";

//   if (
//     /(politics|election|government|senate|president|minister|assembly|campaign|vote)/.test(
//       lower
//     )
//   )
//     return "Politics";

//   if (
//     /(security|kidnap|terror|bandit|police|army|military|attack|gunmen|abduction|violence)/.test(
//       lower
//     )
//   )
//     return "Security";

//   return "Other";
// };

// function cleanText(text) {
//   return text
//     .replace(/\n/g, " ") // Remove newline characters
//     .replace(/\t/g, " ") // Remove tabs
//     .replace(/\s+/g, " ") // Collapse multiple spaces
//     .replace(/&nbsp;/g, " ") // Handle HTML entities
//     .replace(/&#[0-9]+;/g, "") // Remove numeric HTML entities
//     .trim(); // Trim whitespace
// }

// const fetchRssArticles = async () => {
//   const allArticles = [];

//   for (const feed of rssFeeds) {
//     try {
//       const parsed = await parser.parseURL(feed.url);

//       parsed.items.slice(0, 15).forEach((item) => {
//         let image = null;
        
//         // Check Image
//         if (item["media:content"] && item["media:content"]["$"]) {
//           image = item["media:content"]["$"].url;
//         } else if (item.enclosure && item.enclosure.url) {
//           image = item.enclosure.url;
//         } else if (item.content && item.content.includes("<img")) {
//           // fallback: extract from HTML with regex
//           const match = item.content.match(/<img.*?src="(.*?)"/);
//           image = match ? match[1] : null;
//         }

//         // Clean Text
//         const snippet = cleanText(item.contentSnippet || item.content || "");
//         const title = cleanText(item.title || "");
//         const contentCategory = `${title} ${snippet}`;
//         const category = categorizeArticle(contentCategory);
//         allArticles.push({
//           title: item.title || "",
//           link: item.link || "",
//           snippet,
//           pubDate: item.pubDate,
//           source: feed.name,
//           image,
//           category,
//         });
//       });
//     } catch (err) {
//       console.error(`Failed to fetch RSS from ${feed.name}`, err);
//       return;
//     }
//   }

//   return allArticles;
// };
