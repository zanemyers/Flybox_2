// import { prisma, JobType, JobStatus } from "../../db.ts";
// import { BaseAPI } from "../base/index.ts";
// import { ShopReel } from "./shopReel.js";
//
// /**
//  * ShopReelAPI handles creating and tracking ShopReel scraping jobs.
//  */
// export class ShopReelAPI extends BaseAPI {
//     /**
//      * Creates a new ShopReel scraping job.
//      *
//      * @returns Responds with the new job ID and status
//      */
//     async handleCreateJob(req: Request) {
//         try {
//             // Create a new job in the database
//             const job = await prisma.job.create({
//                 data: { type: JobType.SHOP_REEL, status: JobStatus.IN_PROGRESS },
//             });
//
//             // Determine payload: either a file upload or query parameters
//             const formData = await req.formData();
//
//             const file = req.files?.[0];
//             const payload = file
//                 ? { file }
//                 : {
//                     apiKey: req.body.apiKey,
//                     query: req.body.searchTerm,
//                     lat: parseFloat(req.body.latitude),
//                     lng: parseFloat(req.body.longitude),
//                     maxResults: parseInt(req.body.maxResults, 10),
//                 };
//
//             // Start the scraper asynchronously
//             const scraper = new ShopReel(job.id, payload);
//             scraper.shopScraper().catch((err) => {
//                 console.error(`ShopScraper failed for job ${job.id}:`, err);
//             });
//
//             // Respond with the job ID and initial status
//             res.status(201).json({ jobId: job.id, status: job.status });
//         } catch (error) {
//             res.status(500).json({ error: `Failed to create ShopReel job: ${error}` });
//         }
//     }
//
//     /**
//      * Returns a list of files available for download for a given ShopReel job.
//      *
//      * @param {object} job - The job object containing file buffers (primaryFile, secondaryFile, etc.)
//      * @returns {Array<{name: string, buffer: string}>} Array of downloadable files
//      */
//     getFiles(job) {
//         const files = [];
//
//         if (job) {
//             if (job.primaryFile) {
//                 files.push({
//                     name: "shop_details.xlsx",
//                     buffer: Buffer.from(job.primaryFile).toString("base64"),
//                 });
//             }
//
//             if (job.secondaryFile) {
//                 files.push({
//                     name: "simple_shop_details.xlsx",
//                     buffer: Buffer.from(job.secondaryFile).toString("base64"),
//                 });
//             }
//         }
//
//         return files;
//     }
// }
