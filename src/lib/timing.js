import ReactDOMServer from 'react-dom/server';
import ReactRender from 'fast-react-render';

function timingReact(component) {
    let a = Date.now();
    let str = ReactDOMServer.renderToStaticMarkup(component.A);
    let b = Date.now();
    return {
        time: b - a,
        result: str
    };
}

function timingFastReact(component) {
    let a = Date.now();
    let str = ReactRender.elementToString(component.B);
    let b = Date.now();
    return {
        time: b - a,
        result: str
    };
}

function profileReact(component) {
  console.profile('react-render');
  ReactDOMServer.renderToStaticMarkup(component.A);
  console.profileEnd('react-render');
}


function profileFastReact(component) {
  console.profile('fast-react-render');
  ReactRender.elementToString(component.B);
  console.profileEnd('fast-react-render');
}


export { timingReact, timingFastReact, profileReact, profileFastReact };
