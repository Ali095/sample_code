export class DTO {
    id?: string = undefined;
    updatedAt?: Date = undefined;
    createdAt?: Date = undefined;
}

export type DTOCreate<T> = Omit<T, keyof DTO>