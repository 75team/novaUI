define(['module/base/1.0.0/base'], function(Base) {
    Base = Base || this.Base;
    
    describe('Aspect', function() {
        describe('before', function() {
            it('before callback should be called before the bind function', function() {
                var result;
                var callback = sinon.spy(function() {
                    result = this.a;
                });
                var ins = new Base();
                var context = { a: 1 }
                ins.say = function() {console.log('hello')}
                ins.before('say', callback, context);
                ins.say();
                expect(callback.callCount).to.equal(1);
                expect(result).to.equal(1);
            });
        });
        describe('before', function() {
            it('the function should not be called if the before function return false', function() {
                var callback = function() {
                    result = this.a;
                    return false;
                };
                var ins = new Base();
                var say = sinon.spy(function() {console.log('hello');});
                ins.say = say;
                ins.before('say', callback, context);
                ins.say();
                expect(say.callCount).to.equal(0);
            });
        });
        describe('after', function() {
            it('after callback should be called after the bind function', function() {
                var result;
                var callback = sinon.spy(function() {
                    result = this.a;
                });
                var ins = new Base();
                var context = { a: 1 }
                ins.say = function() {console.log('hello')}
                ins.talk = function() {};
                ins.after('say talk', callback, context);
                ins.talk();
                ins.say();
                expect(callback.callCount).to.equal(2);
                expect(result).to.equal(1);
            });
        });
        describe('callback', function() {
            it('should share the same arguments', function() {
                var ins = new Base();
                ins.say = function() {};
                ins.before('say', function() {
                    console.log(arguments);
                    expect(arguments.length).to.equal(3);
                    expect(arguments[0]['type']).to.equal('before:say');
                    expect(arguments[1]).to.equal('haha');
                    expect(arguments[2]).to.equal('hehe');
                });
                ins.say('haha', 'hehe');
            }); 
        });
    });

});
