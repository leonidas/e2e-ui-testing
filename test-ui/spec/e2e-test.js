const assert = require('assert');

const config = require('config');
console.log('config:', config);

const models = require('../../server/models');

describe('The site', function() {
  before(async function () {
    await models.createTables();
  });

  beforeEach(async function () {
    await models.King.truncate();
  });

  it('should be accessible', function() {
    browser.url('/');
    assert.equal(browser.getTitle(), 'End-to-end testing demo');
  });

  it('should find kings when they exist', async function() {
    await models.King.create({name: 'Leonidas'});
    await models.King.create({name: 'Laconicus'});

    browser.url('/')

    const content = await browser.getText('body');

    assert(content.includes('This is sparta!'));
    assert(content.includes('Leonidas'));
    assert(content.includes('Laconicus'));
  });

  it('should not find missing kings', async function() {
    browser.url('/')

    const content = await browser.getText('body');

    assert(content.includes('This is sparta!'));
    assert(!content.includes('Leonidas'), 'does not have the first king');
    assert(!content.includes('Laconicus'), 'does not have the last king');
  });
});
