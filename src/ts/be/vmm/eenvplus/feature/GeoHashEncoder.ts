module be.vmm.eenvplus.feature {
    'use strict';

    var BASE_32 = [
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'm',
            'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
        ],
        BITS = [16, 8, 4, 2, 1];

    export function encodePointHash(bbox:ol.Extent, point:ol.Coordinate, precision:number):string {
        var x = point[0],
            y = point[1],
            ix = [bbox[0], bbox[2]],
            iy = [bbox[1], bbox[3]],
            hash = '',
            even = true,
            bit = 0,
            ch = 0;

        while (hash.length < precision) {
            if (even) {
                var mx = (ix[0] + ix[1]) / 2.0;
                if (x > mx) {
                    /* tslint:disable */
                    ch |= BITS[bit];
                    ix[0] = mx;
                } else {
                    ix[1] = mx;
                }
            } else {
                var my = (iy[0] + iy[1]) / 2.0;
                if (y > my) {
                    /* tslint:disable */
                    ch |= BITS[bit];
                    iy[0] = my;
                } else {
                    iy[1] = my;
                }
            }

            even = !even;

            if (bit < 4) {
                bit++;
            } else {
                hash += BASE_32[ch];
                bit = 0;
                ch = 0;
            }
        }

        return hash;
    }

}
