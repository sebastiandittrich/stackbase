const expect = require('expect.js')

const adapters = [
    'fsAdapter',
    'MemoryAdapter'
]

describe('Adapters', function() {
    for(let adaptername of adapters) {
        describe(adaptername, function() {

            const {[adaptername]: adapter} = require('../dist/Adapters/' + adaptername)
            const number = Math.random().toString()

            describe('#write()', function() {
                it('exists', function() {
                    expect(adapter.write).to.be.a(Function)
                })
                it('writes testfile successfully', function() {
                    return adapter.write('testfile', number)
                })
            })
            describe('#read()', function() {
                it('exists', function() {
                    expect(adapter.read).to.be.a(Function)
                })
                it('reads testfile correctly', async function() {
                    expect(await adapter.read('testfile')).to.be(number)
                })
            })
            describe('#list()', async function() {
                it('exists', function() {
                    expect(adapter.list).to.be.a(Function)
                })
                it('contains testfile', async function() {
                    expect(await adapter.list()).to.contain('testfile')
                })
            })

        })
    }
})