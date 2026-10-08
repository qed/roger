import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { hasScrolledPast, isTextField, stickyBarVisible } from './stickyBar.ts';

const SHOWN = { heroCtaPassed: true, finalBandVisible: false, fieldFocused: false, liveCtaCount: 2 };

describe('stickyBarVisible', () => {
  it('shows once the hero CTA has scrolled past', () => {
    assert.equal(stickyBarVisible(SHOWN), true);
    assert.equal(stickyBarVisible({ ...SHOWN, heroCtaPassed: false }), false);
  });

  it('hides while a field has focus or the final band is visible', () => {
    assert.equal(stickyBarVisible({ ...SHOWN, fieldFocused: true }), false);
    assert.equal(stickyBarVisible({ ...SHOWN, finalBandVisible: true }), false);
  });

  it('hides entirely when every CTA is unconfigured', () => {
    assert.equal(stickyBarVisible({ ...SHOWN, liveCtaCount: 0 }), false);
  });
});

describe('isTextField', () => {
  it('treats text inputs, textareas and selects as fields', () => {
    assert.equal(isTextField({ tagName: 'INPUT', type: 'email' }), true);
    assert.equal(isTextField({ tagName: 'input' }), true);
    assert.equal(isTextField({ tagName: 'TEXTAREA' }), true);
    assert.equal(isTextField({ tagName: 'SELECT' }), true);
  });

  it('ignores buttons, checkboxes, ranges and non-fields', () => {
    assert.equal(isTextField({ tagName: 'INPUT', type: 'checkbox' }), false);
    assert.equal(isTextField({ tagName: 'INPUT', type: 'range' }), false);
    assert.equal(isTextField({ tagName: 'BUTTON' }), false);
    assert.equal(isTextField({ tagName: 'A' }), false);
    assert.equal(isTextField(null), false);
  });
});

describe('hasScrolledPast', () => {
  it('is true only when the element left through the top', () => {
    assert.equal(hasScrolledPast({ isIntersecting: false, boundingClientRect: { bottom: -10 } }), true);
    assert.equal(hasScrolledPast({ isIntersecting: false, boundingClientRect: { bottom: 900 } }), false);
    assert.equal(hasScrolledPast({ isIntersecting: true, boundingClientRect: { bottom: -10 } }), false);
  });
});
