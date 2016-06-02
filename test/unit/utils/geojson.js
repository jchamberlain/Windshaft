require('../../support/test_helper.js');
var geojsonUtils = require('../../../lib/windshaft/utils/geojson_utils');
var assert = require('assert');

describe('geojson-utils', function() {

    function createOptions(interactivity, columns) {
        var options = {
            sql: 'select * from populated_places_simple_reduced',
            cartocss: ['#layer0 {',
                'marker-fill: red;',
                'marker-width: 10;',
                'text-name: [name];',
                '[pop_max>100000] { marker-fill: black; } ',
            '}'].join('\n'),
            cartocss_version: '2.3.0'
        };

        if (interactivity) {
            options.interactivity = interactivity;
        }

        if (columns) {
            options.columns = columns;
        }

        return options;
    }

    describe('with widgets', function () {
        it('should not duplicate column names', function() {
            var properties = geojsonUtils.getGeojsonProperties(createOptions());
            assert.deepEqual(properties, ['pop_max', 'name']);
        });

        it('should handle interactivity strings', function() {
            var properties = geojsonUtils.getGeojsonProperties(createOptions('cartodb_id,pop_max'));
            assert.deepEqual(properties, ['pop_max', 'name', 'cartodb_id']);
        });

        it('should handle interactivity array', function() {
            var properties = geojsonUtils.getGeojsonProperties(createOptions(['cartodb_id', 'pop_max']));
            assert.deepEqual(properties, ['pop_max', 'name', 'cartodb_id']);
        });

        it('should handle columns array', function() {
            var properties = geojsonUtils.getGeojsonProperties(createOptions(null, ['cartodb_id', 'pop_min']));
            assert.deepEqual(properties, ['cartodb_id', 'pop_min', 'pop_max', 'name']);
        });

        it('should handle empty columns array', function() {
            var properties = geojsonUtils.getGeojsonProperties(createOptions(null, []));
            assert.deepEqual(properties, ['pop_max', 'name']);
        });
    });
});