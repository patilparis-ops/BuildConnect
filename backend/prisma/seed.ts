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

  // Get contractor records for portfolio/review creation
  const contractors = await prisma.contractor.findMany({ include: { user: true } });
  const amit = contractors.find(c => c.user.email === "amit.verma@example.com");
  const priyaS = contractors.find(c => c.user.email === "priya.sharma@example.com");
  const rajesh = contractors.find(c => c.user.email === "rajesh.kumar@example.com");

  // Create portfolio items
  if (amit) {
    await prisma.portfolioItem.createMany({
      data: [
        { contractorId: amit.id, title: "Luxury Villa Renovation", description: "Complete renovation of a 5,000 sq ft villa in Juhu. Included structural changes, premium flooring, and smart home integration.", category: "Renovation", completedAt: "2025-11", location: "Juhu, Mumbai" },
        { contractorId: amit.id, title: "Green Building Project", description: "Eco-friendly residential complex with solar panels, rainwater harvesting, and sustainable materials.", category: "New Build", completedAt: "2025-08", location: "Powai, Mumbai" },
      ],
    });
    console.log("Created portfolio items for Amit");
  }

  if (priyaS) {
    await prisma.portfolioItem.createMany({
      data: [
        { contractorId: priyaS.id, title: "Modern Office Interior", description: "Complete interior design for a 10,000 sq ft corporate office. Open plan layout with breakout zones.", category: "Commercial", completedAt: "2026-01", location: "Gurugram" },
        { contractorId: priyaS.id, title: "Minimalist Home Design", description: "Full home interior for a 3 BHK apartment with Scandinavian-inspired minimalist design.", category: "Residential", completedAt: "2025-09", location: "New Delhi" },
      ],
    });
    console.log("Created portfolio items for Priya S");
  }

  if (rajesh) {
    await prisma.portfolioItem.createMany({
      data: [
        { contractorId: rajesh.id, title: "Smart Home Wiring", description: "Complete smart home electrical installation including automation, security systems, and energy management.", category: "Electrical", completedAt: "2026-03", location: "Pune" },
        { contractorId: rajesh.id, title: "Solar Panel Installation", description: "50kW solar panel installation for a commercial building. Grid-connected with battery backup.", category: "Solar", completedAt: "2025-07", location: "Hinjewadi, Pune" },
      ],
    });
    console.log("Created portfolio items for Rajesh");
  }

  // Create quotations
  const projects = await prisma.project.findMany();
  if (projects.length > 0 && amit) {
    await prisma.quotation.create({
      data: {
        projectId: projects[0].id,
        contractorId: amit.id,
        estimatedPrice: 675000,
        timeline: "8-10 weeks",
        proposal: "We propose a comprehensive renovation plan including premium vitrified tiles, modular kitchen from leading brands, waterproofing, and complete electrical rewiring.",
        status: "PENDING",
        materials: { items: ["Vitrified tiles (600x600mm)", "Modular kitchen set", "PVC flooring", "Asian paints"] },
      },
    });
    console.log("Created quotation for project 1");
  }

  if (projects.length > 0 && priyaS) {
    await prisma.quotation.create({
      data: {
        projectId: projects[0].id,
        contractorId: priyaS.id,
        estimatedPrice: 720000,
        timeline: "10 weeks",
        proposal: "Our design-first approach will transform your space with custom furniture, premium finishes, and expert project management.",
        status: "PENDING",
      },
    });
    console.log("Created quotation for project 1 (Priya)");
  }

  // Create a completed project with a review
  if (cust1 && amit) {
    const completedProject = await prisma.project.create({
      data: {
        customerId: cust1.id,
        title: "Kitchen Remodeling - Modular Kitchen",
        description: "Complete kitchen remodeling with modular cabinets, granite countertops, and new flooring.",
        category: "renovation",
        status: "COMPLETED",
        budgetMin: 200000,
        budgetMax: 350000,
        location: "Bandra, Mumbai",
        propertyType: "Apartment",
        propertySize: 150,
        awardedTo: amit.id,
      },
    });

    await prisma.review.create({
      data: {
        projectId: completedProject.id,
        customerId: cust1.id,
        contractorId: amit.id,
        rating: 5,
        title: "Excellent work! Highly recommend",
        comment: "Amit did an amazing job with our kitchen. The quality of work was exceptional and he completed the project on time. Would definitely hire again.",
      },
    });
    console.log("Created completed project with review");
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
