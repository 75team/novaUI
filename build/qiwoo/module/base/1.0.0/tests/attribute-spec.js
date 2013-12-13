define(['module/base/1.0.0/base'], function(Base) {
    Base = Base || this.Base;
    
    describe('Attribute', function() {
        describe('inherit', function() {
            it('should inherit attributes of super class', function() {
                var Animal = Base.extend({ attrs: { a: 1 } });
                var Dog = Animal.extend({ attrs: { b: 2 } });
                var Goldendog = Dog.extend({ attrs: { c: 3 } });
                var dog = new Goldendog();

                expect(dog.get('a')).to.equal(1);
                expect(dog.get('b')).to.equal(2);
                expect(dog.get('c')).to.equal(3);

            });
        });
        describe('getter setter', function() {
            it('should work well', function() {
                var Animal = Base.extend({
                    attrs: {
                        a: {
                            value: 1,
                            getter: function(val, name) {
                                return val + '!';
                            },
                            setter: function(val, name, options) {
                                if(val < 0) return ATTRIBUTE.INVALID_VALUE;
                                return options.a + val;
                            }
                        }
                    }
                });
                var dog = new Animal();

                expect(dog.get('a')).to.equal('1!');
                expect(dog.set('a', -1)).to.equal(false);
                expect(dog.set('a', 1, {data: {a:2}})).to.equal(true);
                expect(dog.get('a')).to.equal('3!');

            });
            it('should accept right arguments', function() {
                var Animal = Base.extend({
                    attrs: {
                        a: {
                            value: 1,
                            getter: function(val, name) {
                                expect(val).to.equal(-1);
                                expect(name).to.equal('a');
                                return val;
                            },
                            setter: function(val, name, options) {
                                expect(val).to.equal(-1);
                                expect(name).to.equal('a');
                                expect(options.b).to.equal(1);
                                return val;
                            }
                        },
                        b: {
                            value: {
                                c: {
                                    d: 1
                                }
                            },
                            getter: function(val, name) {
                                expect(val.c.d).to.equal(1);
                                expect(name).to.equal('b.c.d');
                                return val;
                            },
                            setter: function(val, name, options) {
                                expect(val.c.d).to.equal(-1);
                                expect(name).to.equal('b.c.d');
                                expect(options.b).to.equal(1);
                                return val;
                            }
                        }
                    }
                });
                var dog = new Animal();

                dog.set('a', -1, {data: {b:1}});
                dog.get('a');

                //dog.set('b.c.d', -1, {b:1});
                dog.get('b.c.d');

            });
        });
        describe('get / set sub-attribte', function() {
            it('work well', function() {
                var Animal = Base.extend({ attrs: { 
                    a: {
                        value: {b: { c: 1}},
                        mergeOnInit: true
                    } 
                }});

                var dog = new Animal();
                expect(dog.set('a.b.c', 2)).to.equal(true);
                expect(dog.get('a.b.c')).to.equal(2);

                expect(dog.set('a.b.d', {e:1})).to.equal(true);
                expect(dog.get('a.b.d.e')).to.equal(1);

                expect(dog.set('a.c.d', {e:1})).to.equal(false);
                expect(dog.get('a.c.d.e')).to.equal(undefined);

                expect(dog.set('a.b', {e:1}, {merge: true})).to.equal(true);
                expect(dog.get('a.b.e')).to.equal(1);
                expect(dog.get('a.b.c')).to.equal(2);

                expect(dog.get('a.b').c).to.equal(2);
                expect(dog.get().a.b.c).to.equal(2);

                expect(dog.set({a: {b: 30}})).to.equal(true);
                expect(dog.get('a.b')).to.equal(30);
                expect(dog.get('a.b.c')).to.equal(undefined);

            });
        });
        describe('change event', function() {
            it('work well', function() {
                var callback = sinon.spy();
                var callback2 = sinon.spy();
                var Animal = Base.extend({ 
                    attrs: { 
                        a: 1,
                        b: 1
                    },
                    _onChangeA: function(ev, val, prev, name, options) {
                        expect(val).to.equal(2);
                        expect(prev).to.equal(1);
                        expect(name).to.equal('a');
                        expect(options.b).to.equal(1);
                    },
                    _onChangeB: callback2
                });
                var dog = new Animal();
                dog.on('change:a', callback);
                dog.on('change:b', callback2);
                dog.set('a', 2, {data: {b: 1}});
                dog.set('b', 2, {data: {b: 1}});
                expect(callback.callCount).to.equal(1);
                expect(callback2.callCount).to.equal(2);
            });
        });
        describe('config', function() {
            it('work well', function() {
                var Animal = Base.extend({ 
                    attrs: { 
                        a: 1,
                        b: {
                            c: 2,
                            d: 3
                        }
                    }
                });
                var dog = new Animal({a: 5, e:3, b:{c:4}})
                expect(dog.get('a')).to.equal(5);
                expect(dog.get('e')).to.equal(3);
                expect(dog.get('b.c')).to.equal(4);
            });
        });
    });

});
