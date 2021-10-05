import { RandomColor } from '../index';

test('RandomColor is defined', () => {
    expect(RandomColor()).toBeDefined();
});
test('RandomColor returns a string', () => {
    expect.stringContaining(RandomColor());
});