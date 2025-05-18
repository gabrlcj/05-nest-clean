import { UniqueEntityID } from '../entities/value-object/unique-entity-id'

export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueEntityID
}
