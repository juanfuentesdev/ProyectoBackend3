import UserDTO from '../dto/User.dto.js';

export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getUserCurrent(user) {

        return new UserDTO(user);
    }
    

}