import Component from '../../views/component';

class About extends Component {
    static async render() {
        return `
            <div class="about"> 
                <div class="about__logo">
                    <img src="../../../styles/img/logo.png" alt="image">
                </div>
                
                <h1 class="page-title">Easy Task</h1>                   
                <button class="about__btn-start wave_btn">
                    <span class="wave_btn_text">Start using</span>
                    <span class="wave_btn_waves"></span>
                </button>
            </div>
        `;
    }

    static afterRender() {
        this.setActions();
    }

    static setActions() {
        const startBtn = document.getElementsByClassName('about__btn-start')[0];

        startBtn.onclick = () => this.redirectToNextPage();
    }

    static redirectToNextPage() {
        sessionStorage.getItem('user') !== null ? location.hash = '#/tasks' : location.hash = '#/login';
    }
}

export default About;