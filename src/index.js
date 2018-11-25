import Core from './Core';
import WorksPageTemplate from './templates/SecondPage.html';
import MainPageTemplate from './templates/FirstPage.html';
import ProfilePage from './templates/Profile.html';
import { updatePlace, updatePrice } from './views/game/updateNodes';
import './styles/index.scss';
import getData from './views/login/login.js';
import getProfile from './views/profile/profile.js';

window.user = {};

let emailFromStorage = localStorage.getItem("email");
let idFromStorage = localStorage.getItem("id");

if(emailFromStorage){
    window.user.email = emailFromStorage;
}
if(idFromStorage){
    window.user.id = idFromStorage;
}

const initSecondPage = function(oldRoute, transClass, id) {
    // Each page must have this method!
    // In this function you can assign params to variables, start some async actions
    const param = id && parseInt(Core.removeSlashes(id));
    console.log('Init second page with param: ', param);
    Core.addElement(WorksPageTemplate, 'page works-page ' + transClass);
    Core.pageAnimationInit(oldRoute, transClass);

}

const initFirstPage = function(oldRoute, transClass) {
    // Each page must have this method!
    // In this function you can assign params to variables, start some async actions
    console.log('will mount first page');
    Core.addElement(MainPageTemplate, 'page main-page ' + transClass);
    Core.pageAnimationInit(oldRoute, transClass);
}

const initProfilePage = function(oldRoute, transClass, id) {
    //const param = id && parseInt(Core.removeSlashes(id));
    //console.log('Init profile page with param: ', param);
    Core.addElement(ProfilePage, 'page works-page ' + transClass);
    Core.pageAnimationInit(oldRoute, transClass);

}

const didMountFirstPage = function () {
    // Here you will do the most action, now page is ready
    console.log('Did mount first page')
}

const didMountSecondPage = function() {
    // Here you will do the most action, now page is ready
    console.log('Did mount second page');
    updatePlace('Polska', 'Random');
    updatePrice('2 000');
}

const didMountProfilePage = function() {
    // Here you will do the most action, now page is ready
    getProfile(window.user);

}

const willUnmountFirstPage = function() {
    // Page will me removed soon
    console.log('will unmount first page');
}

const willUnmountSecondPage = function() {
    // Page will me removed soon
    console.log('will unmount first page');
}

const didRemovedFirstPage = function() {
    // Page was removed :(
    console.log('Did remove first page')
}

const didRemovedSecondPage = function() {
    // Page was removed :(
    console.log('Did remove second page')
}

Core.setupRoutes([
    {
        name: 'FIRST', // For developers, to easy recognize route, it isn't used by core
        path: /^$/, // url to page
        index: 0, // index, to decide from which side naimations should start
        initHandler: initFirstPage,
        mountedHandler: didMountFirstPage,
        willUnmountHandler: willUnmountFirstPage,
        didRemove: didRemovedFirstPage,
        events: [ // list of events
            {
                element: '#form', // selector to element
                type: 'submit', // type of event
                handler: getData // action
            },
        ],
    },
    {
        name: 'SECONDARY',
        path: /^second(\/(\d{1,2}))?$/,
        index: 1,
        initHandler: initSecondPage,
        mountedHandler: didMountSecondPage,
        willUnmountHandler: willUnmountSecondPage,
        didRemove: didRemovedSecondPage,
        events: [
            {
                element: '.profile', // selector to element
                type: 'click', // type of event
                handler: Core.redirect('/profile') // action
            },
        ]
    },
    {
        name: 'PROFILE',
        path: /profile/,
        index: 2,
        initHandler: initProfilePage,
        mountedHandler: didMountProfilePage,
        events: []
    },
]);


window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  e.prompt();
});


/* Field and methods of Core
addElement(
    newContent: HTML is string,
    classList: class list in string, 
    container: HTML node
): void // All params are optional

addEventListenerManually(
    element: selector to element in string,
    type: name of event in string,
    handler: function
): void

redirect(
    path: url to page in string
): void

setupRoutes(
    routes: array of routes
): void

removeSlashe(
    input: string
): string
// remove string without slashes on edges

pageAnimationInit(oldRoute, transClass)
// don't try to understeand, it's necessary for router

device = {
    isDesktop: boolean,
    isMobile: boolean,
    isTouchDevice: boolean
}
// help to recognice device
*/