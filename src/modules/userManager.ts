import { UserParams, User } from './user.js';

class UserManager {
    userMap: Map<number, User> = new Map();

    getAllUsers(): User[] {
        return Object.values(Object.fromEntries(this.userMap));
    }

    private createNewUser(userParams: Omit<UserParams, "id">): User {
        const lastId: number = this.userMap.size;
        const newUser = new User({
            id: lastId,
            ...userParams,
        });
        return newUser;
    }

    addUser(userParams: Omit<UserParams, "id">): User {
        const newUser = this.createNewUser(userParams);
        this.setUser(newUser);
        return newUser;
    }

    // лучше ли оставить тип undefined ?
    getUser(userId: number): User | null {
        const user = this.userMap.get(userId);
        if (user)
            return user;
        else
            return null;
    }

    setUser(user: User): void {
        this.userMap.set(user.id, user);
    }

    removeUser(userId: number): boolean {
        if (this.userMap.has(userId)) {
            this.userMap.delete(userId);
            return true;
        }
        return false;
    }

    editUser(userId: number, newUserParams: Partial<Omit<UserParams, "id">>): boolean {
        const editedUser = this.userMap.get(userId);
        if (editedUser === undefined)
            return false;

        for (let [key, value] of Object.entries(newUserParams)) {
            editedUser[key] = value;
        }
        return true;
    }

}

export { UserManager };