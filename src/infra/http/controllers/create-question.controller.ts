import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { z } from 'zod'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const bodyValidation = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('questions')
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async handle(
    @Body(bodyValidation) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { title, content } = body
    const userId = user.sub

    const slug = this.generateSlug(title)

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    })
  }

  private generateSlug(title: string): string {
    if (!title) return ''

    const slug = title
      .toLowerCase()
      .normalize('NFD')
      // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    return slug
  }
}
