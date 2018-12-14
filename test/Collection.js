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
        console.log('instance data:')
        console.log(instance.builder)
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
    // describe('#patch()', function() {
    //     it('patches objects', function() {
    //         instance.update('test', {my: 'object'})
    //         instance.patch('test', {not: 'yours'})
    //         expect(instance.state.test).to.eql({ my: 'object', not: 'yours' })
    //     })
    //     it('pushes to arrays', function() {
    //         instance.update('test', [])
    //         instance.patch('test', 'item')
    //         expect(instance.state.test[0]).to.be('item')
    //     })
    //     it('updates property if it\'s a primitive type', function() {
    //         instance.update('test', 'value')
    //         instance.patch('test', 'newvalue')
    //         expect(instance.state.test).to.be('newvalue')
    //     })
    // })
    describe('#remove()', function() {
        it('removes values', async function() {
            const item = await instance.insert({tobe: 'removed'})
            expect(instance.find(item.id)).not.to.be(undefined)
            instance.remove(item.id)
            expect(instance.find(item.id)).to.be(undefined)
        })

    })

    // describe('save and refresh', function() {
    //     let instance2;
    //     const object = { my: ['deep', { little: 'object' }] }

    //     it('creates second instance', async function() {
    //         instance2 = await Database.make('test', { storageAdapter: MemoryAdapter })
    //         expect(instance2).to.be.a(Database)
    //     })
    //     it('saves on the first instance', async function() {
    //         instance.update('test', object)
    //         expect(await instance.save()).to.be.ok()
    //     })
    //     it('refreshes on the second instance', async function() {
    //         expect(await instance2.refresh()).to.be.ok()
    //     })
    //     it('has equal state on the first and on the second instance', function() {
    //         expect(instance.state.test).to.eql(object)
    //         expect(instance2.state.test).to.eql(object)
    //         expect(instance2.state).to.eql(instance.state)
    //     })
    // })
});