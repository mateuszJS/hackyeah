import Router from './Router';

const mainElement = document.querySelector('main');
let listeners = [];

const addElement = function(newContent, classList, container) {
  const div = document.createElement('div');//create div for page container
  div.className = classList;//too avoid replacing whole content of <main> tag
  div.innerHTML = newContent;//at one time
  const parent = container || mainElement;
  parent.appendChild(div);
};

const pageAnimationInit = function(oldRoute, transClass) {
  if(transClass) {
      animateRoute(oldRoute, transClass);
  } else {
      Router.isTrainsition = false;//if we don't need tranistion
  }
}

// To manually add event, without router
const addEventListenerManually = function(element, type, handler) {
  mainElement.querySelector(element).addEventListener(type, handler);
  listeners.push({
      element: element,
      type: type,
      handler: handler
  });
}

const addEventListeners = function() {
  if(Router.currentAddress.events && Router.currentAddress.events.length) {
      Router.currentAddress.events.map( event => {
          const element = (typeof event.element === 'string') ? document.querySelector(event.element) : event.element;
          element.addEventListener(event.type, event.handler);
          listeners.push(event);
      })
  }
}

const removeEventListeners = function() {
  if(listeners.length) {//remove all listeners of previous page
      listeners.map( event => {
          const element = (typeof event.element === 'string') ? document.querySelector(event.element) : event.element;
          element.removeEventListener(event.type, event.handler);
      });
      listeners = [];
  }
} 

const animateRoute = function(oldRoute, transClass) {
  removeEventListeners();
  const oldPage = mainElement.children.length === 2 ? mainElement.children[0] : undefined;
  const nextPage = mainElement.children.length === 2 ? mainElement.children[1] : mainElement.children[0];//get second child, which is next page to show
  let mounting = false;
  // oldRoute is routing object
  // oldPage is node element
  const onTransitionEnd = function(event) {
      // when first anamitaion finished
      if(!mounting && Router.currentAddress.mountedHandler) {//mouting variable to make sure to call only once mountedHandler
          Router.currentAddress.mountedHandler();
          mounting = true;
      }
      // when last animation finished
      if(event.target.classList.contains('delay-4')) {//in event.elapsedTime chrome involves delay, firefox doesn't
          nextPage.removeEventListener('transitionend', onTransitionEnd);
          //maybe we can add it to one element, not for whole page
          oldPage && mainElement.removeChild(oldPage);//first url doesn't have oldPage
          nextPage.classList.remove('to-stage');
          oldRoute && oldRoute.didRemove && oldRoute.didRemove();//first url doesn't have oldRoute
          //it user change route durgin tranistion, for example by back/forward button in browser
          Router.isTrainsition = false;
          const address = Router.getAddress();
          const match = address.match(Router.currentAddress.path);
          if(!match) { // when user clicked previous page button
              Router.navigate(address, true);
          } else {//is route is valid, add event listeners to elements
              addEventListeners();
          }
      }
  }
  nextPage.addEventListener('transitionend', onTransitionEnd);//page object doesn't have a "transition" properties in sass
  window.getComputedStyle(nextPage).opacity; // we neet to triger next reflow by reading one properties which need's calculate something by reflow
  oldPage && oldPage.classList.add(transClass === 'trans-right' ? 'trans-left' : 'trans-right');//it's caused by reflow isn't synchronicious
  nextPage.classList.add('to-stage');
  nextPage.classList.remove('trans-left', 'trans-right');
  oldRoute && oldRoute.willUnmountHandler && oldRoute.willUnmountHandler();
}

const navigateToThis = function() {
  if(!Router.isTrainsition) {
      Router.navigate(this);
  }
}

const redirect = function(path) {
    return navigateToThis.bind(path);
}

window.addEventListener('popstate', function(e) {
  if(!Router.isTrainsition) {
      Router.navigate(e.state || '/', true);
  }
});

const removeSlashes = function(id) {
    return Router.removeSlashes(id);
}

//=====================START OF HELPERS TO RECOGNIZE CURRENT DEVICE====================//
const device = {
    isDesktop: true,
    isMobile: false,
    isTouchDevice: false
}

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  device.isDesktop = false;
  device.isMobile = true;
}

if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    device.isTouchDevice = true;
}
const updateCSSunit = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', updateCSSunit);
updateCSSunit();

//=====================END OF HELPERS TO RECOGNIZE CURRENT DEVICE====================//
const setupRoutes = function(routes) {
    // if (('ontouchstart' in window) || DocumentTouch && document instanceof DocumentTouch) {
    //     device.isTouchDevice = true;
    // }
    Router.routes = routes;
    Router.initialize();
}

export default {
    addElement,
    addEventListenerManually,
    redirect,
    setupRoutes,
    removeSlashes,
    pageAnimationInit,
    device
}
