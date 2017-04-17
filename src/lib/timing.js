import ReactDOMServer from 'react-dom/server';
import ReactRender from 'fast-react-render';
import React from 'react';

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

export { timingReact, timingFastReact };
