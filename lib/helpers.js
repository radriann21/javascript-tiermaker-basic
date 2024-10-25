/*  helpers  */
/**
 * 
 * @param {string} selector A HTML Selector
 * @returns HTMLElement
 */
export const $ = selector => document.querySelector(selector)


/**
 * 
 * @param {string} selector A HTML Selector
 * @returns NodeList
 */
export const $$ = selector => document.querySelectorAll(selector)