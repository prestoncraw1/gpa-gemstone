/**
 * @jest-environment jsdom
 */

import { GetNodeSize } from '../index';

function testElement(height: string, width: string, top: string, left: string): HTMLElement {
     document.body.innerHTML =
        '<div>' +
        '  <span id="username" />' +
        '  <p id="button" />' +
        '</div>';
    const $ = require('jquery');
    return $('#button')
}

test('GetNodeSize null', () => {
    expect(GetNodeSize(null)).toStrictEqual({
        height: 0,
        width: 0,
        top: 0,
        left: 0,
    });
});

/*
test('GetNodeSize', () => {
    expect(GetNodeSize(testElement('200px', '400px', '40px', '50px'))).toStrictEqual({
        height: 200,
        width: 400,
        top: 40,
        left: 50,
    });
});

test('GetNodeSize negative width', () => {
    expect(GetNodeSize(testElement('200px', '-400px', '40px', '50px'))).toStrictEqual({
        height: 200,
        width: 400,
        top: 40,
        left: 50,
    });
});
*/
