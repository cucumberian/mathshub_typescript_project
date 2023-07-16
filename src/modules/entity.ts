interface Identifiable {
    id: number;
}

class Entity <T extends Identifiable> {
    params: T;

    constructor(params: T) {
        this.params = params;
    }
}

class EntityManager<T extends Identifiable, C extends Entity<T>> {
    collection: Map<number, C> = new Map();

    getAllEntities(): C[] {
        return Object.values(Object.fromEntries(this.collection));
    }

    getSize(): number {
        return this.collection.size;
    }
}

// class EntityManager<T extends Identifiable> {
//     collection: Map<number, Entity<T>> = new Map();


//     getAllEntities(): Entity<T>[] {
//         return Object.values(Object.fromEntries(this.collection));
//     } 

//     createNewEntity(params: Omit<T, "id">): Entity<T> {
//         const lastId = this.collection.size;
//         const newEntity = new Entity<T>({
//             id: lastId,
//             ...params,      // params as any
//         } as T);
//         return newEntity;
//     }

//     setEntity(entity: Entity<T>): void {
//         this.collection.set(entity.params.id, entity);
//     }

//     addEntity(params: Omit<T, "id">): Entity<T> {
//         const newEntity = this.createNewEntity(params);
//         this.setEntity(newEntity);
//         return newEntity;
//     }

//     getEntity(entityId: number): Entity<T> | null {
//         const entity = this.collection.get(entityId);
//         if (entity)
//             return entity;
//         else
//             return null;
//     }

//     removeEntity(entity: Entity<T>): boolean {
//         if(this.collection.has(entity.params.id)) {
//             this.collection.set(entity.params.id, entity);
//             return true;
//         }
//         return false;
//     }

//     editEntity(
//         entityId: number,
//         newEntityParams: Partial<Omit<T, "id">>,
//     ): boolean {
//         const editedEntity = this.collection.get(entityId);
//         if (editedEntity === undefined)
//             return false;
        
//         for (let [key, value] of Object.entries(newEntityParams)) 
//             editedEntity.params[key] = value;
//         return true;
//     }
// }

export { Entity, EntityManager};
