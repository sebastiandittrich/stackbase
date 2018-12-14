var expect = require('expect.js')
var {CollectionBuilder} = require('../dist/CollectionBuilder')

describe('CollectionBuilder', function() {
    let instance;
    let state = {}
    it('creates new instance', function() {
        instance = new CollectionBuilder(state)
        expect(instance).to.be.an(CollectionBuilder)
    });

    describe('#set()', function() {
        it('changes property', function() {
            instance.set('property', 'works')
            expect(state.property).to.be('works')
        })
        it('creates nested property', function() {
            instance.set('nested.property', 'works')
            expect(state.nested.property).to.be('works')
        })
        it('creates missing arrays', function() {
            expect(state.array).to.be(undefined)
            instance.set('array[0]', 'works')
            expect(state.array[0]).to.be('works')
        })
    })

    describe('#get()', function() {
        it('returns correct item', function() {
            const random = Math.random()
            state.item = random
            expect(instance.get('item')).to.be(random)
        })
    })

    describe('#unset()', function() {
        it('deletes the right path', function() {
            state.item = 'should be deleted'
            expect(state.item).to.be('should be deleted')
            instance.unset('item')
            expect(state.item).to.be(undefined)
        })
    })
  });