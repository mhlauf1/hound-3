import assert from 'node:assert/strict'
import test from 'node:test'

import {formatUsPhoneNumber} from '../../lib/formatUsPhoneNumber.ts'
import {
  contactFormSchema,
  isAllowedRecaptchaHostname,
  isHoneypotFilled,
  MAX_CONTACT_BODY_BYTES,
  readContactBody,
} from './formValidation.ts'

const validPayload = {
  name: 'Taylor Smith',
  email: 'taylor@example.com',
  phone: '(651) 788-9797',
  service: 'General Inquiry',
  petName: 'Scout',
  message: 'I would like to learn more about your services.',
  companyWebsite: '',
  recaptchaToken: 'token',
}

test('formats a ten-digit US phone number progressively', () => {
  assert.equal(formatUsPhoneNumber('651'), '651')
  assert.equal(formatUsPhoneNumber('651788'), '(651) 788')
  assert.equal(formatUsPhoneNumber('6517889797'), '(651) 788-9797')
  assert.equal(formatUsPhoneNumber('+1 (651) 788-9797'), '(651) 788-9797')
  assert.equal(formatUsPhoneNumber('(651) 788-9797 extra digits'), '(651) 788-9797')
})

test('accepts the published Hound Around form contract', () => {
  assert.equal(contactFormSchema.safeParse(validPayload).success, true)
})

test('requires service and accepts all published service choices', () => {
  assert.equal(contactFormSchema.safeParse({...validPayload, service: undefined}).success, false)
  for (const service of ['Daycare', 'Boarding', 'Grooming', 'General Inquiry']) {
    assert.equal(contactFormSchema.safeParse({...validPayload, service}).success, true)
  }
})

test('rejects unknown fields and recipient manipulation', () => {
  assert.equal(
    contactFormSchema.safeParse({...validPayload, _recipientEmail: 'attacker@example.com'}).success,
    false,
  )
})

test('rejects invalid service choices and oversized messages', () => {
  assert.equal(
    contactFormSchema.safeParse({...validPayload, service: 'Not a real service'}).success,
    false,
  )
  assert.equal(
    contactFormSchema.safeParse({...validPayload, message: 'x'.repeat(5001)}).success,
    false,
  )
})

test('rejects invalid phone numbers and control characters in names', () => {
  assert.equal(contactFormSchema.safeParse({...validPayload, phone: 'not-a-phone'}).success, false)
  assert.equal(contactFormSchema.safeParse({...validPayload, name: 'Taylor\nBcc: test'}).success, false)
})

test('recognizes only non-empty honeypot values', () => {
  assert.equal(isHoneypotFilled('https://spam.example'), true)
  assert.equal(isHoneypotFilled('  '), false)
  assert.equal(isHoneypotFilled(undefined), false)
})

test('allows only the intended production, preview, and local hostnames', () => {
  assert.equal(isAllowedRecaptchaHostname('www.houndaroundresort.com', {nodeEnv: 'production'}), true)
  assert.equal(isAllowedRecaptchaHostname('houndaroundresort.com', {nodeEnv: 'production'}), true)
  assert.equal(isAllowedRecaptchaHostname('evil.example', {nodeEnv: 'production'}), false)
  assert.equal(
    isAllowedRecaptchaHostname('hound-3-frontend-ab12cd34-mhlauf1s-projects.vercel.app', {
      nodeEnv: 'production',
      vercelEnv: 'preview',
      vercelUrl: 'hound-3-frontend-ab12cd34-mhlauf1s-projects.vercel.app',
    }),
    true,
  )
  assert.equal(
    isAllowedRecaptchaHostname(
      'hound-3-frontend-git-fix-conta-6f9ecd-mhlauf1s-projects.vercel.app',
      {
        nodeEnv: 'production',
        vercelEnv: 'preview',
        vercelBranchUrl:
          'hound-3-frontend-git-fix-conta-6f9ecd-mhlauf1s-projects.vercel.app',
      },
    ),
    true,
  )
  assert.equal(
    isAllowedRecaptchaHostname('hound-3-frontend-unrelated-mhlauf1s-projects.vercel.app', {
      nodeEnv: 'production',
      vercelEnv: 'preview',
      vercelUrl: 'hound-3-frontend-ab12cd34-mhlauf1s-projects.vercel.app',
    }),
    false,
  )
  assert.equal(isAllowedRecaptchaHostname('localhost', {nodeEnv: 'development'}), true)
})

test('rejects an oversized JSON body even when content-length is absent', async () => {
  const request = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({message: 'x'.repeat(MAX_CONTACT_BODY_BYTES)}),
  })

  assert.equal(request.headers.get('content-length'), null)
  assert.deepEqual(await readContactBody(request), {status: 'too-large'})
})

test('rejects a non-JSON request body', async () => {
  const request = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {'content-type': 'text/plain'},
    body: 'not json',
  })

  assert.deepEqual(await readContactBody(request), {status: 'invalid'})
})

test('reads a valid JSON request body', async () => {
  const request = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {'content-type': 'application/json; charset=utf-8'},
    body: JSON.stringify(validPayload),
  })

  assert.deepEqual(await readContactBody(request), {status: 'valid', value: validPayload})
})
