const axios = require('axios');
const { getSelectorValue } = require('../../src/services/getSelectorValue');

jest.mock('axios');

describe('getSelectorValue', () => {
    it('should return selector value', async function () {
        axios.get.mockResolvedValue({ data: '<h1 id="announceDate">announce date</h1>' });

        const res = await getSelectorValue('resourceUrl', '#announceDate');

        expect(res).toEqual('announce date');
    });
});
