import { PixiCss } from '../src/index';
import '../src/index';

describe('PixiCss', () => {
    describe('init', () => {
        it('should be added to prototype', () => {
            const pixiCss = new PixiCss({
                htmlContent: '<div></div>',
                cssContent: 'div { color: red; }'
            });

            expect('init' in pixiCss).toBe(true);
        });


    });
});
