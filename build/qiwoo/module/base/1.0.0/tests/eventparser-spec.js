define(['module/base/1.0.0/base'], function(Base) {
    Base = Base || this.Base;
    
    describe('Events in config', function() {
        describe('onChangeAttr', function() {
            it('should bind to event change:attr', function() {
                var MyClass = Base.extend({
                    attrs: {
                        a: 1
                    }
                });

                var callback = sinon.spy();
                var ins = new MyClass({
                    onChangeA: callback
                });

                ins.set('a', 2);
                expect(callback.callCount).to.equal(1);
                expect(ins.get('onChangeA')).to.equal(undefined);
            });
        });
        describe('before/after', function() {
            it('should bind to event before:methodName', function() {
                var MyClass = Base.extend({
                    eat: function() {}
                });

                var callback = sinon.spy();
                var callback2 = sinon.spy();
                var ins = new MyClass({
                    beforeEat: callback,
                    afterEat: callback2
                });

                ins.eat();
                expect(callback.callCount).to.equal(1);
                expect(callback2.callCount).to.equal(1);
                expect(ins.get('beforeEat')).to.equal(undefined);
                expect(ins.get('afterEat')).to.equal(undefined);
            });
        });
    });
    describe('Events in prototype', function() {
        describe('_onChangeAttr', function() {
            it('should bind to event change:attr', function() {
                var callback = sinon.spy();
                var MyClass = Base.extend({
                    attrs: {
                        a: 1
                    },
                    _onChangeA: callback
                });

                var ins = new MyClass({
                });

                ins.set('a', 2);
                expect(callback.callCount).to.equal(1);
            });
        });
        describe('_beforeMethod/_afterMethod', function() {
            it('should bind to event before:methodName', function() {
                var callback = sinon.spy();
                var callback2 = sinon.spy();
                var MyClass = Base.extend({
                    eat: function() {},
                    _beforeEat: callback,
                    _afterEat: callback2
                });

                var ins = new MyClass({
                });

                ins.eat();
                expect(callback.callCount).to.equal(1);
                expect(callback2.callCount).to.equal(1);
            });
        });
    });
});
