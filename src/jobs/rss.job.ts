import cron from "node-cron";
import { fetchAndSaveRssArticles } from "../services/rssFetcher.service";

cron.schedule("0 0 */2 * *", async () => {
  console.log("Fetching RSS articles...");
  await fetchAndSaveRssArticles();
});
