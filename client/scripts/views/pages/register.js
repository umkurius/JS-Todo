import Component from '../../views/component';

import Users from '../../models/users';

class Register extends Component {
    static async render() {
        return `
            <div class="registration">
            
                <h1>Create account</h1>
                
                <input class="registration__input" type="text" id="name" name="name" placeholder="Username" required>
      
                <input class="registration__input" type="password" id="password" name="password" placeholder="Password" required>
                
                <button class="registration__btn button">Register</button>
                
                <a href="#/login">Login</a>
                
            </div>
        `;
    }

    static afterRender() {
        this.setActions();
    }

    static setActions() {
        const nameField = document.getElementById('name'),
            passwordField = document.getElementById('password'),
            registerBtn = document.getElementsByClassName('registration__btn')[0],
            usersField = document.getElementsByClassName('registration')[0];

        registerBtn.onclick = () => this.registerUser(nameField, passwordField, usersField);
    }


    static async registerUser(nameField, passwordField, usersField) {
        let newUser = {
            username: nameField.value.trim(),
            password: passwordField.value.trim()
        };

        newUser = await Users.registration(newUser);

        this.redirectToLogin();

        usersField.insertAdjacentHTML('beforeEnd', this.getUserHTML(newUser));
    }

    static redirectToLogin() {
        location.hash = '#/login';
    }

    static getUserHTML(user) {
        return `
            <div data-id="${user.id}">
                <div>Hello ${user.name}</div>                           
            </div>
        `;
    }
}

export default Register;