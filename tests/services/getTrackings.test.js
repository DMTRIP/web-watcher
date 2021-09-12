jest.mock('../../src/tracking.model');
const TrackingModel = require('../../src/tracking.model');
const { getTrackings } = require('../../src/services/getTrackings');

describe('getTrackings', () => {
    it('should return all trackings', async function () {

        await getTrackings();

        expect(TrackingModel.find).toHaveBeenCalled();
    });
});
