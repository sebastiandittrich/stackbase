const { MemoryAdapter } = require("../dist/Adapters/MemoryAdapter")
const { Collection } = require("../dist/Collection")
const expect = require('expect.js')

describe('Collection', function() {
    let instance;

    it('creates new instance', async function() {
        instance = await Collection.make('test', { storageAdapter: MemoryAdapter })
        expect(instance).to.be.a(Collection)
    })

    it('has an empty state', function() {
        expect(instance.length).to.be(0)
    })

    describe('#insert()', function() {
        it('inserts documents', async function() {
            const document = await instance.insert({insert: 'works'})
            expect(document.insert).to.be('works')
            expect(instance.length).to.be.greaterThan(0)
        })
    })
    describe('#update()', function() {
        it('upates documents', async function() {
            const item = await instance.insert({value: 'first'})
            expect(item.value).to.be('first')
            await instance.update(item.id, 'value', 'second')
            expect(item.value).to.be('second')
        })
    })

    describe('#remove()', function() {
        it('removes values', async function() {
            const item = await instance.insert({tobe: 'removed'})
            expect(instance.find(item.id)).not.to.be(undefined)
            instance.remove(item.id)
            expect(instance.find(item.id)).to.be(undefined)
        })

    })

    describe('save and refresh', function() {
        let instance2;
        let item;
        let item2;

        it('creates second instance', async function() {
            instance2 = await Collection.make('test', { storageAdapter: MemoryAdapter })
            expect(instance2).to.be.a(Collection)
        })
        it('synchronizes inserts', async function() {
            item = await instance.insert({value: 'first'})
            item2 = await instance2.insert({another: 'insert'})
            await instance2.refresh()

            expect(instance2.find(item.id)).not.to.be(undefined)
        })
        it('synchronizes updates', async function() {
            await instance.update(item.id, 'value', 'second')
            await instance2.refresh()

            expect(instance2.find(item.id).value).to.be('second')
        })
        it('synchronizes removes', async function() {
            await instance.remove(item.id)
            await instance2.refresh()

            expect(instance2.find(item.id)).to.be(undefined)
        })
        it('ignores updates on removed elements', async function() {
            await instance.refresh()
            await instance.remove(item2.id)
            await instance2.update(item2.id, 'another', 'test')
            await instance.refresh()

            expect(instance.find(item2.id)).to.be(undefined)
        })
        it('builds actions in the right order when refreshed', async function() {
            await instance.refresh()
            await instance2.refresh()

            item = await instance.insert({value: 'a new one!'})

            await instance.update(item.id, 'value', 'first')
            await instance2.update(item.id, 'value', 'second')

            await instance2.refresh()

            expect(instance2.find(item.id).value).to.be('second')
        })
        // it('refreshes on the second instance', async function() {
        //     expect(await instance2.refresh()).to.be.ok()
        // })
        // it('has equal state on the first and on the second instance', function() {
        //     expect(instance.state.test).to.eql(object)
        //     expect(instance2.state.test).to.eql(object)
        //     expect(instance2.state).to.eql(instance.state)
        // })
    })
});