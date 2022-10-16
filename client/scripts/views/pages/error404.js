import Component from '../../views/component';

class Error404 extends Component {
    static async render() {
        return `                
            <h1 class="page-title">404 Error - Page Not Found</h1>              
        `;
    }
}

export default Error404;