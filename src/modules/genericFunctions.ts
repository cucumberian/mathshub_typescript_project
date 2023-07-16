function mapToList<T>(map: Map<number, T>): T[] {
    return Object.values(Object.fromEntries(map));
}

// не работает, т.к. есть скрытые поля
function editEntity<T> (
    map: Map<number, T>,
    entityId: number,
    params: Partial<Omit<T, "id">>
): boolean {
    const editedEntity = map.get(entityId);
    if (editEntity === undefined) 
        return false
    
    for (let [key, value] of Object.entries(params))
        editEntity[key] = value;
    return true;   
}


function getEntity<T>(map: Map<number, T>, entityId: number): T | null {
    const entity = map.get(entityId);
    if (entity)
        return entity
    else
        return null;
}

export { mapToList, editEntity, getEntity };