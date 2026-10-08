import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { endorsementLogoSrc, hostPackHref, sameOriginPath } from './safeHref.ts';

describe('sameOriginPath / endorsementLogoSrc', () => {
  it('accepts a same-origin path, trimmed', () => {
    assert.equal(sameOriginPath('/logos/ossington.svg'), '/logos/ossington.svg');
    assert.equal(endorsementLogoSrc('  /logos/a.png '), '/logos/a.png');
  });

  it('rejects anything that could load from another origin, and empties', () => {
    for (const bad of ['', '   ', undefined, null, 'https://x.test/a.png', 'http://x.test/a.png', '//x.test/a.png', '/\\x.test/a.png', 'javascript:alert(1)', 'data:image/png;base64,AAAA', 'logos/a.png']) {
      assert.equal(endorsementLogoSrc(bad), null, String(bad));
    }
  });
});

describe('hostPackHref (spec §6B.5)', () => {
  it('accepts a same-origin path or an https URL', () => {
    assert.equal(hostPackHref('/workshop-host-pack.pdf'), '/workshop-host-pack.pdf');
    assert.equal(hostPackHref(' https://files.example.ca/host-pack.pdf '), 'https://files.example.ca/host-pack.pdf');
    assert.equal(hostPackHref('HTTPS://files.example.ca/a.pdf'), 'HTTPS://files.example.ca/a.pdf');
  });

  it('hides the section for anything else', () => {
    for (const bad of ['', '  ', undefined, null, 'http://x.test/a.pdf', 'javascript:alert(1)', 'data:application/pdf;base64,AA', '//x.test/a.pdf', '/\\x.test/a.pdf', 'https://', 'https:///a.pdf', 'workshop-host-pack.pdf', 'https://x.test/a b.pdf']) {
      assert.equal(hostPackHref(bad), null, String(bad));
    }
  });
});
