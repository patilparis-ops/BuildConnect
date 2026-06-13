import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const password = await bcrypt.hash("password123", 12);

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.project.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.contractor.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  // Create admin
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@buildconnect.in",
      password,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
      isVerified: true,
      admin: { create: { permissions: ["all"] } },
    },
  });
  console.log("Created admin:", adminUser.email);

  // Create customers
  const customer1 = await prisma.user.create({
    data: {
      email: "priya@example.com",
      password,
      firstName: "Priya",
      lastName: "Mehta",
      phone: "+91 98765 43210",
      role: "CUSTOMER",
      isVerified: true,
      customer: {
        create: { street: "12 Marine Drive", city: "Mumbai", state: "Maharashtra", zipCode: "400001", country: "India" },
      },
    },
  });
  console.log("Created customer:", customer1.email);

  const customer2 = await prisma.user.create({
    data: {
      email: "arjun@example.com",
      password,
      firstName: "Arjun",
      lastName: "Singh",
      phone: "+91 87654 32109",
      role: "CUSTOMER",
      isVerified: true,
      customer: {
        create: { street: "45 Koramangala 5th Block", city: "Bangalore", state: "Karnataka", zipCode: "560034", country: "India" },
      },
    },
  });
  console.log("Created customer:", customer2.email);

  // Get customer records
  const cust1 = await prisma.customer.findUnique({ where: { userId: customer1.id } });
  const cust2 = await prisma.customer.findUnique({ where: { userId: customer2.id } });

  // Create contractors
  await prisma.user.create({
    data: {
      email: "amit.verma@example.com",
      password,
      firstName: "Amit",
      lastName: "Verma",
      phone: "+91 99887 76655",
      role: "CONTRACTOR",
      isVerified: true,
      contractor: {
        create: {
          profession: "Builder",
          specialties: ["Residential Construction", "Renovation", "Site Management"],
          experience: 15,
          rating: 4.8,
          reviewCount: 127,
          completedProjects: 342,
          verified: true,
          bio: "With over 15 years of experience in residential and commercial construction, I deliver quality projects on time and within budget.",
          hourlyRate: 1500,
          availability: "available",
          location: "Mumbai, Maharashtra",
          serviceRadius: 50,
          certifications: {
            create: [
              { name: "B.Tech Civil Engineering", issuer: "IIT Delhi", issueDate: "2010-06-01", verified: true },
              { name: "NICMAR Project Management", issuer: "NICMAR", issueDate: "2012-08-15", verified: true },
            ],
          },
        },
      },
    },
  });
  console.log("Created contractor: amit.verma@example.com");

  await prisma.user.create({
    data: {
      email: "priya.sharma@example.com",
      password,
      firstName: "Priya",
      lastName: "Sharma",
      phone: "+91 88776 65544",
      role: "CONTRACTOR",
      isVerified: true,
      contractor: {
        create: {
          profession: "Interior Designer",
          specialties: ["Interior Design", "Space Planning", "Home Staging", "Kitchen Design"],
          experience: 10,
          rating: 4.9,
          reviewCount: 89,
          completedProjects: 215,
          verified: true,
          bio: "Award-winning interior designer with a passion for creating beautiful, functional spaces.",
          hourlyRate: 2000,
          availability: "available",
          location: "Delhi, NCR",
          serviceRadius: 30,
          certifications: {
            create: [
              { name: "NIFT Interior Design", issuer: "NIFT Delhi", issueDate: "2014-05-20", verified: true },
            ],
          },
        },
      },
    },
  });
  console.log("Created contractor: priya.sharma@example.com");

  await prisma.user.create({
    data: {
      email: "rajesh.kumar@example.com",
      password,
      firstName: "Rajesh",
      lastName: "Kumar",
      phone: "+91 77665 54433",
      role: "CONTRACTOR",
      isVerified: true,
      contractor: {
        create: {
          profession: "Electrician",
          specialties: ["Smart Home Wiring", "Industrial Electrical", "Solar Installation"],
          experience: 12,
          rating: 4.7,
          reviewCount: 203,
          completedProjects: 1500,
          verified: true,
          bio: "Licensed electrical contractor specializing in residential and commercial electrical work.",
          hourlyRate: 800,
          availability: "available",
          location: "Pune, Maharashtra",
          serviceRadius: 40,
          certifications: {
            create: [
              { name: "Licensed Electrical Contractor", issuer: "Government of Maharashtra", issueDate: "2015-03-10", verified: true },
            ],
          },
        },
      },
    },
  });
  console.log("Created contractor: rajesh.kumar@example.com");

  // Create projects
  if (cust1) {
    await prisma.project.create({
      data: {
        customerId: cust1.id,
        title: "Complete Home Renovation - 3 BHK Apartment",
        description: "Looking for an experienced contractor to renovate our 3 BHK apartment. Work includes new flooring, modular kitchen, bathroom remodeling, and full interior painting.",
        category: "renovation",
        status: "QUOTING",
        budgetMin: 500000,
        budgetMax: 800000,
        location: "Andheri West, Mumbai",
        propertyType: "Apartment",
        propertySize: 1200,
        requirements: ["Licensed contractor", "Insurance coverage", "Previous project references", "Detailed timeline"],
        quoteCount: 5,
      },
    });
    console.log("Created project: Complete Home Renovation");
  }

  if (cust2) {
    await prisma.project.create({
      data: {
        customerId: cust2.id,
        title: "New House Construction - 2000 sq ft",
        description: "Need a reliable builder for constructing a new 2000 sq ft independent house on our plot.",
        category: "new_build",
        status: "OPEN",
        budgetMin: 2500000,
        budgetMax: 3500000,
        location: "Whitefield, Bangalore",
        propertyType: "House",
        propertySize: 2000,
        requirements: ["Experience with modern homes", "Structural warranty", "Eco-friendly materials preferred"],
        quoteCount: 3,
      },
    });
    console.log("Created project: New House Construction");
  }

  console.log("\n✓ Seeding complete!");
  console.log("\nTest accounts:");
  console.log("  Admin:      admin@buildconnect.in / password123");
  console.log("  Customer:   priya@example.com / password123");
  console.log("  Customer:   arjun@example.com / password123");
  console.log("  Contractor: amit.verma@example.com / password123");
  console.log("  Contractor: priya.sharma@example.com / password123");
  console.log("  Contractor: rajesh.kumar@example.com / password123");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
