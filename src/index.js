import Core from './Core';
import WorksPageTemplate from './templates/SecondPage.html';
import MainPageTemplate from './templates/FirstPage.html';
import InitSimulation from './views/game/addSimulation';
import { submitTrack } from './views/game/trackController';
import './styles/index.scss';
import getData from './views/login/login.js';

const initSecondPage = function(oldRoute, transClass, id) {
    // Each page must have this method!
    // In this function you can assign params to variables, start some async actions
    const param = id && parseInt(Core.removeSlashes(id));
    console.log('Init second page with param: ', param);
    Core.addElement(WorksPageTemplate, 'page works-page ' + transClass);
    Core.pageAnimationInit(oldRoute, transClass);
    InitSimulation();
}

const initFirstPage = function(oldRoute, transClass) {
    // Each page must have this method!
    // In this function you can assign params to variables, start some async actions
    console.log('will mount first page');
    Core.addElement(MainPageTemplate, 'page main-page ' + transClass);
    Core.pageAnimationInit(oldRoute, transClass);
}

const didMountFirstPage = function () {

    // Here you will do the most action, now page is ready
    console.log('Did mount first page')
}

const didMountSecondPage = function() {
    // Here you will do the most action, now page is ready
    console.log('Did mount second page');
}

const willUnmountFirstPage = function() {
    // Page will me removed soon
    console.log('will unmount first page');
}

const didRemovedFirstPage = function() {
    // Page was removed :(
    console.log('Did remove first page')
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
        events: [
            {
                element: '.submit-track',
                type: 'click',
                handler: submitTrack
            },
        ]
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