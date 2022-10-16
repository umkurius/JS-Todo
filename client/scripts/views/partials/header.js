import Component from '../../views/component';

class Header extends Component {
    static async getData() {
        const user = sessionStorage.getItem('user');
        if (user) {
            return user;
        }
    }

    static async render() {
        const page = this.urlParts.page;

        if (sessionStorage.getItem('user') !== null) {
            const user = JSON.parse(sessionStorage.user);

            return `
            <header class="header"> 
                <div class="header__logo">
                    <div class="header__logo-img">
                        <img src="../../../styles/img/logo.png" alt="image">
                    </div>
                    <span>Easy Task</span>
                </div>  
                <div class="header__nav">
                    <a class="header__link ${!page ? 'active' : ''}" href="#/">
                        About
                    </a>
                    <a class="header__link ${page === 'tasks' ? 'active' : ''}" href="#/tasks">
                        Tasks List
                    </a>   
                </div>                 
                 
                <div class="header__usernav">
                    <div class="header__username">${user.username}</div>
                    <button class="header__nav-logout svg-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z"/>
                          <path class="header__logout" d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"/>
                          <path class="header__logout" d="M7 12h14l-3 -3m0 6l3 -3"/>
                        </svg>
                    </button> 
                </div>                                                      
            </header>
            `;
        } else {
            return `
              
            <header class="header">   
                <div class="header__logo">
                    <div class="header__logo-img">
                        <img src="../../../styles/img/logo.png" alt="image">
                    </div>
                    <span>Easy Task</span>
                </div> 
                <div class="header__usernav">
                    <a class="header__link login ${page === 'login' ? 'active' : ''} ${page === 'register' ? 'active' : ''}" href="#/login">Login</a>  
                </div>                                                                       
            </header>
            `;
        }
    }

    static afterRender() {
        this.setActions();
    }

    static setActions() {
        if (sessionStorage.getItem('user') !== null) {
            const logoutBtn = document.getElementsByClassName('header__nav-logout')[0];

            logoutBtn.onclick = () => {
                sessionStorage.clear();
                location.hash = '#/login';
            };
        }
    }
}

export default Header;