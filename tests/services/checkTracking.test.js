const { checkTracking } = require('../../src/services/checkTracking');
jest.mock('../../src/services/getSelectorValue');
const getSelectorValueModule = require('../../src/services/getSelectorValue');
const { notifyUser } = require('../../src/services/notifyUser');
const TrackingModel = require('../../src/tracking.model');

jest.mock('../../src/tracking.model');
jest.mock('../../src/services/notifyUser');

//some new selector value
describe('checkTracking', () => {
    it('should check and update tracking in case of new selector value and notify user', async function () {
        const tracking = {
            resourceUrl: 'resourceUrl',
            cssSelector: 'cssSelector',
            currentValue: 'currentValue',
        };
        TrackingModel.findById.mockReturnValueOnce({ lean: () => tracking });
        Date.now = jest.fn(() => 1487076708000);
        TrackingModel.findOneAndUpdate.mockReturnValueOnce({ lean: () => tracking });
        getSelectorValueModule.getSelectorValue.mockImplementation(() => 'some new selector value');

        await checkTracking(1);

        expect(TrackingModel.findById).toHaveBeenCalledWith(1);
        expect(getSelectorValueModule.getSelectorValue).toHaveBeenCalledWith('resourceUrl', 'cssSelector');
        expect(TrackingModel.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: 1 },
            {
                currentValue: 'some new selector value',
                previousValue: 'currentValue',
                lastCheckedAt: 1487076708000,
            },
            { new: true },
        );
        expect(notifyUser).toHaveBeenCalledWith(tracking);
    });

    it('should check and update check date', async function () {
        const tracking = {
            resourceUrl: 'resourceUrl',
            cssSelector: 'cssSelector',
            currentValue: 'currentValue',
        };
        TrackingModel.findById.mockReturnValueOnce({ lean: () => tracking });
        Date.now = jest.fn(() => 1487076708000);
        getSelectorValueModule.getSelectorValue.mockImplementation(() => 'currentValue');

        await checkTracking(1);

        expect(TrackingModel.findById).toHaveBeenCalledWith(1);
        expect(getSelectorValueModule.getSelectorValue).toHaveBeenCalledWith('resourceUrl', 'cssSelector');
        expect(TrackingModel.updateOne).toHaveBeenCalledWith(
            { _id: 1 },
            {
                lastCheckedAt: 1487076708000,
            },
        );
    });
});
