import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

const prismaDb = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaDb

async function main() {
  // ... you will write your Prisma Client queries here
}

main()
  .then(async () => {
    await prismaDb.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prismaDb.$disconnect()
    process.exit(1)
  })

export default prismaDb;


