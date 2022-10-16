import Component from '../../views/component';

import Users from '../../models/users';

class Login extends Component {
    static async render() {
        return `
            <div class="login">
            
                <h1>Log In</h1>
                
                <input class="login__input" type="text" id="name" name="name" placeholder="Username" required>

                <input class="login__input" type="password" id="password" name="password" placeholder="Password" required>
                
                <button class="login__btn button">Login</button>
                
                <a href="#/register">Create account</a>
                
            </div>
        `;
    }

    static afterRender() {
        this.setActions();
    }

    static setActions() {
        const nameField = document.getElementById('name'),
            passwordField = document.getElementById('password'),
            loginBtn = document.getElementsByClassName('login__btn')[0],
            usersField = document.getElementsByClassName('login')[0];

        loginBtn.onclick = () => this.loginUser(nameField, passwordField, usersField);
    }


    static async loginUser(nameField, passwordField) {
        let userLog = {
            username: nameField.value.trim(),
            password: passwordField.value.trim()
        };

        userLog = await Users.login(userLog);

        if (userLog.token) {
            location.hash = '#/tasks';
        } else {
            alert('Login error');
        }
        this.setUsersToSS(userLog);
    }

    static setUsersToSS(user) {
        sessionStorage.setItem('user', JSON.stringify(user));
    }


}

export default Login;