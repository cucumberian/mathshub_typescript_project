import { UserParams, User } from './user';

class UserManager {
    userMap: Map<number, User>;

    createNewUser(userParams: Omit<UserParams, "id">): User {
        const lastId: number = this.userMap.size;
        const newUser = new User({
            id: lastId,
            ...userParams,
        });
        return newUser;
    }

    addUser(user: User): void {
        this.userMap.set(user.id, user);
    }

    removeUser(user: User): boolean {
        if (this.userMap.has(user.id)) {
            this.userMap.delete(user.id);
            return true;
        }
        return false;
    }

    editUser(new_uper_params: Partial<Omit<UserParams, "id">>) {}

}

export { UserManager };