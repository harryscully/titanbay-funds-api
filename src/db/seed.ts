import "dotenv/config"
import { prisma } from "../lib/prisma"

async function main() {
    await prisma.investment.deleteMany()
    await prisma.investor.deleteMany()
    await prisma.fund.deleteMany()

    const fund1 = await prisma.fund.create({
        data: {
            name: "Titanbay Growth Fund I",
            vintage_year: 2022,
            target_size_usd: 250000000,
            status: "Investing"
        }
    })

    const fund2 = await prisma.fund.create({
        data: {
            name: "Titanbay Opportunities Fund II",
            vintage_year: 2024,
            target_size_usd: 500000000,
            status: "Fundraising"
        }
    })

    const investor1 = await prisma.investor.create({
        data: {
            name: "Goldman Sachs Asset Management",
            investor_type: "Institution",
            email: "investments@gsam.com"
        }
    })

    const investor2 = await prisma.investor.create({
        data: {
            name: "CalPERS",
            investor_type: "Institution",
            email: "privateequity@calpers.ca.gov"
        }
    })

    await prisma.investment.create({
        data: {
            investor_id: investor1.id,
            fund_id: fund1.id,
            amount_usd: 50000000,
            investment_date: new Date("2022-06-15")
        }
    })

    await prisma.investment.create({
        data: {
            investor_id: investor2.id,
            fund_id: fund1.id,
            amount_usd: 75000000,
            investment_date: new Date("2023-01-20")
        }
    })

    console.log("Seed complete ✓")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())