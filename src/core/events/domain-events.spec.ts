import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/value-object/unique-entity-id'
import { DomainEvent } from './domain-event'
import { vi } from 'vitest'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private _aggregate: CustomAggregate //eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.ocurredAt = new Date()
    this._aggregate = aggregate
  }

  public getAggregateId(): UniqueEntityID {
    return this._aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callBackSpy = vi.fn()

    // Subscriber cadastrado (ouvindo o evento de "resposta criada")
    DomainEvents.register(callBackSpy, CustomAggregateCreated.name)

    // Estou criando uma resposta porém SEM salvar no banco
    const aggregate = CustomAggregate.create()

    // Estou assegurando que o evento foi criado porém NÃO foi disparado
    expect(aggregate.domainEvents).toHaveLength(1)

    // Estou salvando a resposta no banco de dados e assim disparando o evento
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // O subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callBackSpy).toHaveBeenCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
