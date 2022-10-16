import Component from '../../views/component';

class Footer extends Component {
    static async render() {
        return `
            <footer class="footer">                   
                <p class="footer__info">
                    &copy; All Rights Reserved, 2022
                </p>                  
            </footer>
        `;
    }
}

export default Footer;