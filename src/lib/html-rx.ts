/*
    html generators using rxjs observables for values
*/

import { Observable, ReplaySubject, Subject } from "rx";

function isObservable(thing: any): thing is Observable<string> {
    return (<Observable<string>>thing).asObservable !== undefined;
}

function isFunction(thing: any): thing is Function {
    return typeof thing === 'function';
}

enum NodeAttribute { 'id', 'class' };
enum ElementAttribute { 'innerHTML', 'innerText' };


export const h = (tagName, attr, children: [any]): Element => {
    let tag: Element = document.createElement(tagName);
    console.log(tagName, attr, children);
    if (attr) {
        for (let key in attr) {
            let val = attr[key];
            if (isObservable(val)) {
                val.subscribe((v) => {
                    if (key in NodeAttribute) {
                        tag.setAttribute(key, `${v}`);
                    } else if (key in ElementAttribute) {
                        tag[key] = v;
                    } else {
                        switch (key) {
                            case 'text':
                                tag.textContent = v;
                                break;
                            default:
                                throw Error(`Don't know what to do with observable key: ${key}`)
                        }
                    }
                });
            } else if (isFunction(val)) {
                // tag.addEventListener(key, val);
                var eventStream = Observable.fromEvent(tag, key);
                var subject = new Subject();
                eventStream.subscribe(
                    x => {
                        subject.onNext(x);
                    }
                );
                subject.subscribe(val);
            } else if (typeof val === 'string') {
                if (key in NodeAttribute) {
                    tag.setAttribute(key, `${val}`);
                } else if (key in ElementAttribute) {
                    tag[key] = val;
                } else {
                    throw Error(`Don't know what to do with key: ${key}`)
                }
            } else {
                throw Error(`Don't know what to do with val: ${typeof val}`)
            }
        }
    }
    if (children) {
        if (typeof children === 'string') {
            tag.innerHTML = children;
        } else {
            for (let child of children) {
                tag.appendChild(child);
            }
            // throw Error(`Don't know what to do with children: ${typeof children}`)
        }
    }
    return tag;
}

export const __ = undefined;
export const div = h.bind(this, 'div');
export const h1 = h.bind(this, 'h1');
export const button = h.bind(this, 'button');
export const span = h.bind(this, 'span');

export const obs_of = (str?) => {
    let s = new ReplaySubject();
    if (str) {
        s.onNext(str);
    }
    return s;
}
