import '../styles/app';
import {parseCurrentURL} from './helpers/utils';

import Header from './views/partials/header';
import Footer from './views/partials/footer';

import AddAndList from './views/pages/tasks/add-list';
import Info from './views/pages/tasks/info';
import Edit from './views/pages/tasks/edit';

import About from './views/pages/about';
import Error404 from './views/pages/error404';
import Login from './views/pages/login';
import Register from './views/pages/register';

const Routes = {
    '/': About,
    '/register': Register,
    '/login': Login,
    '/tasks': AddAndList,
    '/task/:id': Info,
    '/task/:id/edit': Edit
};

function router() {
    (async() => {
        const headerContainer = document.getElementsByClassName('header-container')[0],
            contentContainer = document.getElementsByClassName('content-container')[0];

        const urlParts = parseCurrentURL(),
            pagePath = `/${urlParts.page || ''}${urlParts.id ? '/:id' : ''}${urlParts.action ? `/${urlParts.action}` : ''}`,
            Page = Routes[pagePath] ? Routes[pagePath] : Error404;

        const headerData = await Header.getData();
        headerContainer.innerHTML = await Header.render(headerData);
        Header.afterRender();

        const pageData = await Page.getData();
        contentContainer.innerHTML = await Page.render(pageData);
        Page.afterRender();
    })();
}

(async() => {
    const footerContainer = document.getElementsByClassName('footer-container')[0];

    footerContainer.innerHTML = await Footer.render();
})();

module.hot ? module.hot.accept(router()) : (window.onload = router);
window.onhashchange = router;