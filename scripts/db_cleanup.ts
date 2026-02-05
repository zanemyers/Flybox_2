import { prisma } from "@/lib/db";
import { JobStatus, JobType } from "@/lib/base/constants";

async function cleanupOldJobs() {
    try {
        console.log("Starting cleanup...");

        // Step 1: Delete all FAILED or CANCELED jobs
        console.log(`Removing failed or canceled jobs...`);
        await prisma.job.deleteMany({
            where: {
                status: { in: [JobStatus.FAILED, JobStatus.CANCELED] },
            },
        });

        // Step 2: Keep 5 most recent COMPLETED jobs per JobType, delete the rest
        for (const type of Object.values(JobType)) {
            // Find IDs of the 5 most recent COMPLETED jobs
            const recentCompleted = await prisma.job.findMany({
                where: { type, status: JobStatus.COMPLETED },
                orderBy: { createdAt: "desc" },
                take: 5,
                select: { id: true },
            });

            const keepIds = recentCompleted.map((job) => job.id);

            // Delete older completed jobs for this type
            console.log(`Removing completed ${type} jobs...`);
            await prisma.job.deleteMany({
                where: {
                    type,
                    status: JobStatus.COMPLETED,
                    id: { notIn: keepIds },
                },
            });
        }

        console.log("Finished!");
    } catch (err) {
        console.error("Error during cleanup:", err);
    } finally {
        await prisma.$disconnect();
    }
}

cleanupOldJobs()
    .catch((err) => {
        console.error("Cleanup failed:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
