import {GetTextWidth} from '../index';

test('Test GetTextWidth Functionality', () => {
  expect(GetTextWidth("Times New Roman", "16", "something")).toBe(0);
});