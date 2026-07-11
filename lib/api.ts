import { prisma } from "@/lib/prisma"

// ------------------------------------------------------------
// GET CATEGORIES
// ------------------------------------------------------------
export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" }
  })
}

// ------------------------------------------------------------
// GET JOBS BY CATEGORY
// ------------------------------------------------------------
export async function getJobs(category: string) {
  return prisma.job.findMany({
    where: {
      subcategory: {
        category: {
          name: category
        }
      }
    },
    include: {
      subcategory: { include: { category: true } },
      bookings: true,
      offers: true        // ← FIXED
    },
    orderBy: { createdAt: "desc" }
  })
}

// ------------------------------------------------------------
// GET SINGLE JOB
// ------------------------------------------------------------
export async function getJob(jobId: string) {
  return prisma.job.findUnique({
    where: { id: jobId },
    include: {
      subcategory: { include: { category: true } },
      bookings: true,
      offers: true        // ← FIXED
    }
  })
}

// ------------------------------------------------------------
// CALCULATE PRICE — NOT SUPPORTED BY CURRENT SCHEMA
// ------------------------------------------------------------
export async function calculatePrice(jobId: string, qty: number) {
  // Your Job model has no pricing fields.
  // Keep this as a safe stub so the app compiles.
  return {
    total: 0,
    unitPrice: 0
  }
}

// ------------------------------------------------------------
// CREATE BOOKING — NOT IMPLEMENTED YET
// ------------------------------------------------------------
export async function createBooking(
  jobId: string,
  qty: number,
  name: string,
  email: string,
  phone: string,
  notes: string
) {
  // Booking requires: jobId, customerId, professionalId.
  // Your current UI does not provide those IDs yet.
  // Keep this as a stub so the build passes.
  throw new Error("createBooking is not implemented for the current schema")
}
