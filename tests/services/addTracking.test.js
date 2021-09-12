const { addTracking } = require('../../src/services/addTracking');
const { getSelectorValue } = require('../../src/services/getSelectorValue');
const TrackingModel = require('../../src/tracking.model');

jest.mock('../../src/tracking.model');
jest.mock('../../src/services/getSelectorValue', () => ({
    getSelectorValue: jest.fn(() => 'selector value')
}));

describe('addTracking', () => {
    it('should create tracking', async function () {
      await addTracking({
            resourceUrl: 'resourceUrl',
            title: 'title',
            cssSelector: 'cssSelector',
            checkingIntervalInSeconds: 10,
        });

        expect(getSelectorValue).toHaveBeenCalledWith('resourceUrl', 'cssSelector');
        expect(TrackingModel.create).toHaveBeenCalledWith({
            resourceUrl: 'resourceUrl',
            title: 'title',
            cssSelector: 'cssSelector',
            checkingIntervalInSeconds: 10,
            initialSelectorValue: 'selector value',
            currentValue: 'selector value',
        })
    });
});

