/// <reference path="../../node_modules/@types/ragemp-s/index.d.ts" />

interface PlayerMp {
    loggedIn: boolean;
    // id: number;
    id_sql: number;
    user_id: number;
    // email: string;
    firstName: string;
    lastName: string;
    admin: number;
    dead: boolean;
    usingCreator: boolean;

    updateName(): void;
    isDriver(): boolean;
    teleport(coord: EntityCoord): void;
    setSkin(skinName: string): number;
    sendToWorld(): void;
    sendToCreator(): void;
}



interface EntityCoord {
    pos: Vector3Mp;
    rot: number;
    dim: number;
}