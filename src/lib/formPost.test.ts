import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  HONEYPOT_FIELD,
  buildPayload,
  buildPostBody,
  canSubmit,
  createSubmitter,
  honeypotTripped,
  isValidEmail,
  liveStatusText,
  postJson,
  submitButtonState,
  submitErrorMessage
} from './formPost.ts';
import type { FormErrors, FormStatus, SubmitterOptions } from './formPost.ts';

describe('isValidEmail', () => {
  it('accepts ordinary addresses, trimmed', () => {
    assert.equal(isValidEmail('peter@example.ca'), true);
    assert.equal(isValidEmail('  a.b+c@shop.co.uk '), true);
  });

  it('rejects incomplete addresses', () => {
    for (const bad of ['', 'peter', 'peter@', '@x.ca', 'peter@x', 'pe ter@x.ca']) {
      assert.equal(isValidEmail(bad), false, bad);
    }
  });
});

describe('submitErrorMessage (R12b)', () => {
  it('includes the contact email when set', () => {
    assert.equal(submitErrorMessage('hi@roger.ca'), 'Something went wrong. Try again, or email hi@roger.ca.');
  });

  it('drops the email clause when empty', () => {
    assert.equal(submitErrorMessage(''), 'Something went wrong. Try again.');
    assert.equal(submitErrorMessage('   '), 'Something went wrong. Try again.');
  });
});

describe('buildPayload', () => {
  it('trims values, drops empties and adds UTM fields', () => {
    assert.deepEqual(buildPayload({ email: ' a@b.ca ', note: '  ' }, { utm_source: 'bia', utm_medium: undefined }), {
      utm_source: 'bia',
      email: 'a@b.ca'
    });
  });

  it('never lets UTM overwrite a form field', () => {
    assert.deepEqual(buildPayload({ utm_source: 'typed' }, { utm_source: 'url' }), { utm_source: 'typed' });
  });
});

describe('buildPostBody', () => {
  it('without a shape, is buildPayload over the values', () => {
    assert.deepEqual(buildPostBody({ email: ' a@b.ca ', for: 'work' }, { utm_source: 'qr' }), { utm_source: 'qr', email: 'a@b.ca', for: 'work' });
  });

  it('runs the shape, then trims, drops empties and adds UTM', () => {
    const shape = (v: { first?: string; last?: string }) => ({ full_name: `${v.first ?? ''} ${v.last ?? ''}`, unused: '' });
    assert.deepEqual(buildPostBody({ first: 'Jane', last: 'Doe' }, { utm_medium: 'email', utm_source: undefined }, shape), {
      utm_medium: 'email',
      full_name: 'Jane Doe'
    });
  });

  it('treats a missing value as empty', () => {
    assert.deepEqual(buildPostBody({ email: 'a@b.ca', phone: undefined }), { email: 'a@b.ca' });
  });
});

describe('honeypot', () => {
  it('uses the Formspree field name', () => {
    assert.equal(HONEYPOT_FIELD, '_gotcha');
  });

  it('trips only on a non-blank value', () => {
    for (const empty of ['', '   ', undefined, null]) assert.equal(honeypotTripped(empty), false, String(empty));
    assert.equal(honeypotTripped('http://spam.test'), true);
  });
});

describe('submitButtonState', () => {
  it('is really disabled only when the form cannot submit ("Opening soon")', () => {
    for (const status of ['idle', 'submitting', 'error'] as FormStatus[]) {
      assert.deepEqual(submitButtonState(false, status), { disabled: true, ariaDisabled: false, label: 'openingSoon' });
    }
  });

  it('stays focusable while posting (aria-disabled, not disabled)', () => {
    assert.deepEqual(submitButtonState(true, 'submitting'), { disabled: false, ariaDisabled: true, label: 'submitting' });
    assert.deepEqual(submitButtonState(true, 'idle'), { disabled: false, ariaDisabled: false, label: 'submit' });
    assert.deepEqual(submitButtonState(true, 'error'), { disabled: false, ariaDisabled: false, label: 'submit' });
  });
});

describe('liveStatusText', () => {
  it('announces sending, then the error, and nothing otherwise', () => {
    assert.equal(liveStatusText('submitting', 'Sending…', 'Oops'), 'Sending…');
    assert.equal(liveStatusText('error', 'Sending…', 'Oops'), 'Oops');
    assert.equal(liveStatusText('idle', 'Sending…', 'Oops'), '');
    assert.equal(liveStatusText('success', 'Sending…', 'Oops'), '');
  });
});

describe('postJson', () => {
  it('never submits to an empty endpoint', async () => {
    let called = false;
    const fetchFn = async () => {
      called = true;
      return { ok: true };
    };
    assert.equal(canSubmit('  '), false);
    assert.equal(await postJson(fetchFn, '', { email: 'a@b.ca' }), false);
    assert.equal(called, false);
  });

  it('posts JSON and resolves true only on ok', async () => {
    const calls: { url: string; body: string; headers: Record<string, string> }[] = [];
    const ok = await postJson(
      async (url, init) => {
        calls.push({ url, body: init.body, headers: init.headers });
        return { ok: true };
      },
      ' https://formspree.io/f/x ',
      { email: 'a@b.ca' }
    );
    assert.equal(ok, true);
    assert.equal(calls[0].url, 'https://formspree.io/f/x');
    assert.deepEqual(JSON.parse(calls[0].body), { email: 'a@b.ca' });
    assert.equal(calls[0].headers['Content-Type'], 'application/json');
  });

  it('resolves false on an error status or a network failure', async () => {
    assert.equal(await postJson(async () => ({ ok: false }), 'https://x.test', {}), false);
    assert.equal(
      await postJson(
        async () => {
          throw new Error('offline');
        },
        'https://x.test',
        {}
      ),
      false
    );
  });

  it('gives up after the timeout, aborts the request and resolves false', async () => {
    let signal: AbortSignal | undefined;
    const started = Date.now();
    const ok = await postJson(
      (_url, init) => {
        signal = init.signal;
        return new Promise<{ ok: boolean }>(() => undefined); // never settles, and ignores the abort
      },
      'https://x.test',
      { email: 'a@b.ca' },
      30
    );
    assert.equal(ok, false);
    assert.equal(signal?.aborted, true);
    assert.ok(Date.now() - started < 2000);
  });

  it('a post that answers in time is unaffected by the timeout', async () => {
    let signal: AbortSignal | undefined;
    const ok = await postJson(
      async (_url, init) => {
        signal = init.signal;
        return { ok: true };
      },
      'https://x.test',
      {},
      1000
    );
    assert.equal(ok, true);
    assert.equal(signal?.aborted, false);
  });
});

type V = { email: string };

function harness(post: (values: V) => Promise<boolean>) {
  const log = { posts: 0, statuses: [] as FormStatus[], errors: [] as FormErrors[], successes: 0 };
  const opts: SubmitterOptions<V> = {
    validate: (v): FormErrors => (isValidEmail(v.email) ? {} : { email: 'bad' }),
    post: (v) => {
      log.posts++;
      return post(v);
    },
    onErrors: (e) => log.errors.push(e),
    onStatus: (s) => log.statuses.push(s),
    onSuccess: () => log.successes++
  };
  return { log, submitter: createSubmitter(() => opts) };
}

function deferred() {
  let resolve!: (ok: boolean) => void;
  let reject!: (err: unknown) => void;
  const promise = new Promise<boolean>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('createSubmitter', () => {
  it('never posts invalid input', async () => {
    const { log, submitter } = harness(async () => true);
    assert.equal(await submitter.submit({ email: 'nope' }), 'invalid');
    assert.equal(log.posts, 0);
    assert.deepEqual(log.statuses, ['idle']);
    assert.deepEqual(log.errors, [{ email: 'bad' }]);
  });

  it('ignores a second submit while one is in flight', async () => {
    const d = deferred();
    const { log, submitter } = harness(() => d.promise);
    const first = submitter.submit({ email: 'a@b.ca' });
    assert.equal(await submitter.submit({ email: 'a@b.ca' }), 'busy');
    d.resolve(true);
    assert.equal(await first, 'ok');
    assert.equal(log.posts, 1);
  });

  it('a rejected post reports an error, resets the guard and allows a retry', async () => {
    let call = 0;
    const { log, submitter } = harness(async () => {
      call++;
      if (call === 1) throw new Error('network down');
      return true;
    });
    assert.equal(await submitter.submit({ email: 'a@b.ca' }), 'failed');
    assert.deepEqual(log.statuses, ['submitting', 'error']);
    assert.equal(log.successes, 0);
    assert.equal(await submitter.submit({ email: 'a@b.ca' }), 'ok');
    assert.equal(log.posts, 2);
    assert.deepEqual(log.statuses, ['submitting', 'error', 'submitting', 'success']);
  });

  it('calls onSuccess only on an ok post', async () => {
    const failing = harness(async () => false);
    assert.equal(await failing.submitter.submit({ email: 'a@b.ca' }), 'failed');
    assert.equal(failing.log.successes, 0);
    const passing = harness(async () => true);
    assert.equal(await passing.submitter.submit({ email: 'a@b.ca' }), 'ok');
    assert.equal(passing.log.successes, 1);
  });

  it('ignores submits after a success', async () => {
    const { log, submitter } = harness(async () => true);
    await submitter.submit({ email: 'a@b.ca' });
    assert.equal(await submitter.submit({ email: 'a@b.ca' }), 'done');
    assert.equal(log.posts, 1);
  });

  it('a tripped honeypot shows success silently: no post, no onSuccess, and the form is done', async () => {
    const { log, submitter } = harness(async () => true);
    assert.equal(await submitter.submit({ email: 'a@b.ca' }, 'buy pills'), 'trapped');
    assert.equal(log.posts, 0);
    assert.equal(log.successes, 0);
    assert.deepEqual(log.statuses, ['success']);
    assert.equal(await submitter.submit({ email: 'a@b.ca' }), 'done');
    assert.equal(log.posts, 0);
  });

  it('an empty honeypot posts as normal', async () => {
    const { log, submitter } = harness(async () => true);
    assert.equal(await submitter.submit({ email: 'a@b.ca' }, '  '), 'ok');
    assert.equal(log.posts, 1);
  });

  it('skips status and success callbacks once inactive (unmounted)', async () => {
    const d = deferred();
    const { log, submitter } = harness(() => d.promise);
    const pending = submitter.submit({ email: 'a@b.ca' });
    submitter.setActive(false);
    d.resolve(true);
    assert.equal(await pending, 'ok');
    assert.deepEqual(log.statuses, ['submitting']);
    assert.equal(log.successes, 0);
  });
});
