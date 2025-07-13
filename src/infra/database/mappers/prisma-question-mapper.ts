import { UniqueEntityID } from '@/core/entities/value-object/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { Question as PrismaQuestion } from '@prisma/client'

export class PrismaQuestionMapper {
  /**
   * Converts a PrismaQuestion object from the Prisma schema to a Question entity
   * in the domain layer.
   *
   * @param raw - The PrismaQuestion object to be converted.
   * @returns The corresponding Question entity.
   */
  static toDomain(raw: PrismaQuestion): Question {
    const question = Question.create(
      {
        authorId: new UniqueEntityID(raw.authorId),
        content: raw.content,
        title: raw.title,
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityID(raw.bestAnswerId)
          : null,
        slug: Slug.create(raw.slug),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    )

    return question
  }
}
