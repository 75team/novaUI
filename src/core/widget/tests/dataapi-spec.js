define(['module/widget/1.0.0/widget'], function(Widget) {
    Widget = Widget || this.Widget;
    var MyWidget = Widget.extend({
        attrs: {
            a: 1,
            b: 2,
            obj: null
        }
    });
    
    describe('Data Api', function() {     
        it('should not work when data-api != on', function() {
            var ins = new MyWidget();
            expect(ins.get('a')).to.equal(1);
            ins.destroy();
        });
        it('should work when data-api == on', function() {
            $('.daTester').data('api', 'on');
            var ins = new MyWidget({element: '.daTester'});
            expect(ins.get('a')).to.equal(3);
            expect(ins.get('b')).to.equal('hello');
            expect(ins.get('c')).to.equal(true);
            expect(ins.get('obj.a.b')).to.equal(6);
            ins.destroy();
        });
    });
});
