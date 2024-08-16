import { test, expect } from '@jest/globals';
import { normalizeURL, getURLsFromHTML } from './crawl.js';

// test('empty string', () => {
//   expect(normalizeURL('')).toBe('')
// })

test('https trailing /', () => {
  expect(normalizeURL('https://blog.boot.dev/path/')).toBe('blog.boot.dev/path')
})

test('https no trailing /', () => {
  expect(normalizeURL('https://blog.boot.dev/path')).toBe('blog.boot.dev/path')
})

test('http trailing /', () => {
  expect(normalizeURL('http://blog.boot.dev/path/')).toBe('blog.boot.dev/path')
})

test('http no trailing /', () => {
  expect(normalizeURL('http://blog.boot.dev/path')).toBe('blog.boot.dev/path')
})

test('normalizeURL protocol', () => {
  const input = 'https://blog.boot.dev/path'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('normalizeURL slash', () => {
  const input = 'https://blog.boot.dev/path/'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('normalizeURL capitals', () => {
  const input = 'https://BLOG.boot.dev/path'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('normalizeURL http', () => {
  const input = 'http://BLOG.boot.dev/path'
  const actual = normalizeURL(input)
  const expected = 'blog.boot.dev/path'
  expect(actual).toEqual(expected)
})

test('no anchors', () => {
  const input = '<!DOCTYPE html><p>Hello world</p>'
  const actual = getURLsFromHTML(input, 'boot.dev')
  const expected = []
  expect(actual).toEqual(expected)
})

test('one absolute anchor', () => {
  const input = '<!DOCTYPE html><p>Hello world<a href="https://boot.dev">link</a></p>'
  const actual = getURLsFromHTML(input, 'https://boot.dev')
  const expected = ['https://boot.dev/']
  expect(actual).toEqual(expected)
})

test('one relative anchor', () => {
  const input = '<!DOCTYPE html><p>Hello world<a href="/relative">link</a></p>'
  const actual = getURLsFromHTML(input, 'http://boot.dev')
  const expected = ['http://boot.dev/relative']
  expect(actual).toEqual(expected)
})

test('many absolute anchors', () => {
  const input = '<!DOCTYPE html><p>Hello world<a href="http://boot.dev/absolute">link<a href="https://google.com/nestedabsolute">nested link</a></a></p>'
  const actual = getURLsFromHTML(input, 'https://google.com')
  const expected = ['http://boot.dev/absolute', 'https://google.com/nestedabsolute']
  expect(actual).toEqual(expected)
})

test('many relative anchors', () => {
  const input = '<!DOCTYPE html><p>Hello world<a href="/relative">link</a><a href="/siblingrelative">sibling link</a></p>'
  const actual = getURLsFromHTML(input, 'http://boot.dev')
  const expected = ['http://boot.dev/relative', 'http://boot.dev/siblingrelative']
  expect(actual).toEqual(expected)
})

test('getURLsFromHTML absolute', () => {
  const inputURL = 'https://blog.boot.dev'
  const inputBody = '<html><body><a href="https://blog.boot.dev"><span>Boot.dev></span></a></body></html>'
  const actual = getURLsFromHTML(inputBody, inputURL)
  const expected = [ 'https://blog.boot.dev/' ]
  expect(actual).toEqual(expected)
})

test('getURLsFromHTML relative', () => {
  const inputURL = 'https://blog.boot.dev'
  const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a></body></html>'
  const actual = getURLsFromHTML(inputBody, inputURL)
  const expected = [ 'https://blog.boot.dev/path/one' ]
  expect(actual).toEqual(expected)
})

test('getURLsFromHTML both', () => {
  const inputURL = 'https://blog.boot.dev'
  const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a><a href="https://other.com/path/one"><span>Boot.dev></span></a></body></html>'
  const actual = getURLsFromHTML(inputBody, inputURL)
  const expected = [ 'https://blog.boot.dev/path/one', 'https://other.com/path/one' ]
  expect(actual).toEqual(expected)
})
