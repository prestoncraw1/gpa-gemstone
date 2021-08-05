import { IsNumber } from '../index';
test('IsNumber true int', () => {
    expect(IsNumber(9)).toBeTruthy();
});
test('IsNumber false str', () => {
    expect(IsNumber('hello')).toBeFalsy();
})
test('IsNumber true float', () => {
    expect(IsNumber(4.32)).toBeTruthy();
})
