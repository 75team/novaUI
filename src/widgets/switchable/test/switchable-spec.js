define(['module/Nova.switchable/1.0.0/switchable'], function(Switchable) {
    Switchable = Switchable || this.Switchable;

    var ins = new Switchable({
        index: 0,
        count: 3
    });

    describe('Switchable', function() {
        it('next works well', function() {
            expect(ins.get('index')).to.equal(0);
            ins.next();
            expect(ins.get('index')).to.equal(1);
            ins.next();
            expect(ins.get('index')).to.equal(2);
            ins.next();
            ins.next();
            expect(ins.get('index')).to.equal(2);
        });
        it('switch works well', function() {
            ins.switch(1)
            expect(ins.get('index')).to.equal(1);
            ins.switch(0)
        });
        it('prev works well', function() {
            ins.prev();
            expect(ins.get('index')).to.equal(0);
            ins.switch(2)  
            ins.prev()
            expect(ins.get('index')).to.equal(1);
        });
    });

    //mocha.run();
});