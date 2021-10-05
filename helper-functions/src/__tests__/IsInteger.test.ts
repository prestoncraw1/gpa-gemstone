import { IsInteger } from '../index';
test('IsInteger true', () => {
    expect(IsInteger(9)).toBeTruthy();
});
test('IsInteger false str', () => {
    expect(IsInteger('hello')).toBeFalsy();
})
test('IsInteger false float', () => {
    expect(IsInteger(4.32)).toBeFalsy();
})