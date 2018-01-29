const eslint = require('eslint')
const chai = require('chai')
const expect = chai.expect

const CLIEngine = eslint.CLIEngine

const cli = new CLIEngine({
  useEslintrc: false,
  configFile: 'eslintrc.json',
  rules: {
    'require-jsdoc': 0
  }
})

describe('load config in eslint to validate all rule syntax is correct', () => {
  it('No Errors in valid code', () => {
    const code = 'const foo = 1\nconst bar = function () {}\nbar(foo)\n'

    expect(cli.executeOnText(code).errorCount).to.equal(0)
  })

  it('Throw an error with a semi colon', () => {
    const code = 'const foo = 1;\nconst bar = function () {}\nbar(foo)\n'

    expect(cli.executeOnText(code).errorCount).to.equal(1)
  })

  it('Throw an error with var', () => {
    const code = 'var foo = 1\nconst bar = function () {}\nbar(foo)\n'

    expect(cli.executeOnText(code).errorCount).to.equal(1)
  })

  it('Throw a warning with console.log', () => {
    const code = 'const foo = 1\nconst bar = function () {}\nconsole.log(bar(foo))\n'

    expect(cli.executeOnText(code).warningCount).to.equal(1)
  })

  it('Allow console.info', () => {
    const code = 'const foo = 1\nconst bar = function () {}\nconsole.info(bar(foo))\n'

    expect(cli.executeOnText(code).warningCount).to.equal(0)
  })

  it('Throw an error with non camelcase variable', () => {
    const code = 'const foo_foo = 1\nconst bar = function () {}\nbar(foo_foo)\n'

    expect(cli.executeOnText(code).errorCount).to.equal(1)
  })

  it('Throw an error when arrow function can be used', () => {
    const code = 'const foo = 1\nconst bar = function () {}\nbar(function () {\n  return foo\n})\n'

    expect(cli.executeOnText(code).errorCount).to.equal(1)
  })

  it('Throw a warning with missing jsdoc', () => {
    const code = 'const foo = 1\nconst bar = function () {}\nbar(foo)\n'

    const cli = new CLIEngine({
      useEslintrc: false,
      configFile: 'eslintrc.json'
    })
    expect(cli.executeOnText(code).warningCount).to.equal(1)
    expect(cli.executeOnText(code).errorCount).to.equal(0)
  })

  it('Error with invalid jsdoc', () => {
    const code = 'const foo = 1\n/**\n * [description]\n * @return {[type]}\n [description]\n */\nconst bar = function (id) { return 2 }\nbar(foo)\n'

    const cli = new CLIEngine({
      useEslintrc: false,
      configFile: 'eslintrc.json'
    })
    expect(cli.executeOnText(code).warningCount).to.equal(0)
    expect(cli.executeOnText(code).errorCount).to.equal(1)
  })

  it('Allow with correct jsdoc', () => {
    const code = 'const foo = 1\n/**\n * [description]\n * @param {String} id Given ID\n * @return {[type]}\n [description]\n */\nconst bar = function (id) { return 2 }\nbar(foo)\n'

    const cli = new CLIEngine({
      useEslintrc: false,
      configFile: 'eslintrc.json'
    })
    expect(cli.executeOnText(code).warningCount).to.equal(0)
    expect(cli.executeOnText(code).errorCount).to.equal(0)
  })
})
