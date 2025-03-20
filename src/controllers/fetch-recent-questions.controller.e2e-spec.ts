import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await hash('123456', 8),
      },
    })

    const access_token = jwt.sign({ sub: user.id })

    await prisma.question.createMany({
      data: [
        {
          title: 'New question 01',
          slug: 'new-question-01',
          content: 'New content',
          authorId: user.id,
        },
        {
          title: 'New question 02',
          slug: 'new-question-02',
          content: 'New content',
          authorId: user.id,
        },
      ],
    })

    const fetchRecentQuestionsResponse = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${access_token}`)
      .send()

    expect(fetchRecentQuestionsResponse.status).toBe(200)
    expect(fetchRecentQuestionsResponse.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'New question 01' }),
        expect.objectContaining({ title: 'New question 02' }),
      ],
    })
  })
})
