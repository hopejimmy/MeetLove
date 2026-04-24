const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Me",
      mbti: "INTJ"
    }
  })
  console.log(user)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
