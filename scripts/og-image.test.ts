import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { absoluteOgImage } from './og-image.ts';

const head = `<meta property="og:image" content="/og.png" /><meta name='twitter:image' content='/og.png' />`;

describe('absoluteOgImage', () => {
  it('rewrites both image tags, either quote style', () => {
    const r = absoluteOgImage(head, 'meetroger.ai');
    assert.equal(r.replaced, 2);
    assert.match(r.html, /content="https:\/\/meetroger\.ai\/og\.png"/);
    assert.match(r.html, /content='https:\/\/meetroger\.ai\/og\.png'/);
  });

  it('leaves the html alone for an empty or malformed host', () => {
    for (const host of ['', '   ', 'https://x.com', 'a..b', 'meetroger', 'x.com/path']) {
      assert.deepEqual(absoluteOgImage(head, host), { html: head, replaced: 0 }, host);
    }
  });
});
