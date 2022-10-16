class Users {
    static async registration(newUser) {
        const response = await fetch('http://localhost:3000/auth/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        return await response.json();
    }

    static async login(user) {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        return await response.json();
    }

}

export default Users;