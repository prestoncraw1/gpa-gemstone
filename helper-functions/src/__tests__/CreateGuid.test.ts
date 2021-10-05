import { CreateGuid } from '../index';

// although a guid is of length 32, this will return 36 as it counts the 4 '-' characters
test('CreateGuid proper length', () => {
    expect(CreateGuid()).toHaveLength(36);
});