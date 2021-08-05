/**
 * @jest-environment jsdom
 */

import { GetTextHeight } from '../index';

test('GetTextHeight', () => {
    expect(GetTextHeight('Arial', '12px', 'Word')).toBeDefined();
});


test('GetTextHeight = 50', () => {
    expect(GetTextHeight('arial;', '12px', 'Word')).toEqual(50);
});
