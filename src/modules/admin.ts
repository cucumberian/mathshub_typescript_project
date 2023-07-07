import { UserParams, User } from './user';
import { UserManager } from './userManager';


class Admin extends User {

    constructor (adminParams: UserParams) {
        super(adminParams);
        this.role = Role.Admin;
    }

    addUser(
        userParams: Omit<UserParams, "id">, 
        userManager: UserManager
    ): User {
        const newUser = userManager.createNewUser(userParams);
        userManager.addUser(newUser);
        return newUser;
    }

    removeUser(
        user: User,
        userManager: UserManager,
    ): boolean {
        return userManager.removeUser(user);
    }

    editUser(
        user: User,
        userManager: UserManager,
        newUserParams: Partial<Omit<UserParams, "id">>,
    ): boolean {
        return false;
    }
}

export { Admin };
