jest.mock('../../src/tracking.model');
const { checkSystemHealth } = require('../../src/services/checkSystemHealth');
const TrackingModel = require('../../src/tracking.model');

describe('checkSystemHealth', () => {
    it('should checkSystemHealth and return true if everything is ok', async function () {
        TrackingModel.findOne.mockReturnValue({ lean: () => null });
        jest.spyOn(Date.prototype, 'toISOString').mockReturnValueOnce(123);

        const result = await checkSystemHealth();

        expect(TrackingModel.findOne).toHaveBeenCalledWith({
            $or: [
                    { lastCheckedAt: { $exists: false } },
                    { lastCheckedAt: { $lt: 123 } },
                ]
        });
        expect(result).toBeTruthy();
    });
});
