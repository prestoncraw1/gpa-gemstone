
/**
 * @jest-environment jsdom
 */
import { GetTextWidth } from '../index';
test('use jsdom in this test file', () => {
    const element = document.createElement('div');
    expect(element).not.toBeNull();
});


test('GetTextWidth', () => {
    expect(GetTextWidth('arial;', '12px', 'Word')).toBeDefined();
});

test('GetTextWidth = 50', () => {
    expect(GetTextWidth('arial;', '12px', 'Word')).toBe(50);
});
