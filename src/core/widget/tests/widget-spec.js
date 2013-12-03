define(['module/widget/1.0.0/widget'], function(Widget) {
    Widget = Widget || this.Widget;

    $('<button id="btn">Click me heihei</button>').appendTo(document.body);
    $('<div class="panel"></div>').appendTo(document.body);
    $('<div class="daTester" data-b="hello" data-c="true" data-a="3" data-obj="{\'a\' : {\'b\': 6, \'d\': true}}"></div>').appendTo(document.body);

    var MyWidget = Widget.extend({
        attrs: {
            id: 'myWidgetId', 
            className: 'myWidgetClass',
            events: null,
            template: '<div><a><button class="btn">Click me</button></a></div>',

            name: null

        }, 
        setup: function() {
            this.render();
        },
        sayHi: function() {
            alert('Big brother say hi!');
        },
        _onRenderName: function(ev, val, prev) {
           // alert('change name from ' + prev + ' to ' + val);
        }
    });
    describe('Widget', function() {
        describe('Cache', function() {
            it('should generate an id for each widget instance', function() {
                var ins1 = new MyWidget({className: 'widget1'});
                var ins2 = new MyWidget({className: 'widget2'});
                ins1.render();
                ins2.render();
                expect(ins1.$element.attr('data-widget-id')).to.equal(ins1.wid + '');
                expect(ins2.$element.attr('data-widget-id')).to.equal(ins2.wid + '');
                ins1.destroy();
                ins2.destroy();
            });
            it('should get the instance using Widget.query', function() {
                var ins1 = new MyWidget({className: 'widget1'});
                var ins2 = new MyWidget({className: 'widget2'});
                ins1.render();
                ins2.render();
                expect(Widget.query('.widget1')).to.equal(ins1);
                expect(Widget.query('.widget2')).to.equal(ins2);
                expect(Widget.query('.widget3')).to.equal(undefined);
                ins1.destroy();
                ins2.destroy();
            });
        });
        describe('Element initialization', function() {
            it('if elemnt is passed in, ins.element and ins.$element should refer to it', function() {
                var ins = new MyWidget({
                    element: '.panel'
                });
                expect(ins.element).to.equal($('.panel')[0]);
                expect(ins.$element[0]).to.equal($('.panel')[0]);
                ins.destroy();
            });
            it('if element is not passed in, ini.element and ins.$element are dependent on template', function() {
                var ins = new MyWidget({
                    template: '<hoho></hoho>',
                });
                expect(ins.element.tagName).to.equal('HOHO');
                ins.destroy();
            });
            it('element should be appended to the specific parentNode when rendered', function() {
                var ins = new MyWidget({
                    template: '<hoho></hoho>',
                    parentNode: '.panel'
                });
                expect(ins.$element.parent()[0]).to.equal($('.panel')[0]);
                ins.destroy();
            });
            it('className, id and style should be add to this.element when rendered', function() {
                var ins = new MyWidget({
                    className: 'widgetclass1',
                    id: 'widgetid1',
                    style: {'background-color': 'red'}
                });
                //expect(ins.$element.parent()[0]).to.equal($('.panel')[0]);
                expect(ins.$element.hasClass('widgetclass1')).to.equal(true);
                expect(ins.$element.attr('id')).to.equal('widgetid1');
                expect(ins.$element.css('background-color')).to.equal('rgb(255, 0, 0)');
                ins.destroy();
            });
        });
        describe('onRender', function() {
            it('should be called when the attr is init and changed', function() {
                var ins = new MyWidget({
                    name: 'guagua'
                });
                ins.set('name', 'guaguagau');
                ins.destroy();
            });
        });
        describe('delegate and undelegate events', function() {
            it('should delegate events passed within config', function() {
                var callback = sinon.spy(function(ev) {
                    console.log('this: ', this);
                    console.log('ev: ', ev);
                });
                var ins = new MyWidget({
                    events: {
                        'click .btn': callback,
                    }
                });
                ins.$element.find('.btn').click();
                expect(callback.callCount).to.equal(1);
                ins.destroy();
            });
            it('the handle\'s context should be the ins', function() {
                var ins = new MyWidget({
                    events: {
                        'click a': function(ev) {
                            expect(this).to.equal(ins);
                            expect(ev.target.tagName).to.equal('BUTTON');
                            expect(ev.currentTarget.tagName).to.equal('A');
                        }
                    }
                });
                ins.$element.find('.btn').click();
                ins.destroy();
            });
            it('the handle\'s context should be the ins', function() {
                var ins = new MyWidget({
                });
                ins.delegateEvents('#btn', 'click', function(ev) {
                    expect(this).to.equal(ins);
                });
                $('#btn').click();
                ins.destroy();
            });
            it('delegateEvents(eventKey, handler) works well', function() {
                var ins = new MyWidget({
                });
                var callback = sinon.spy();
                ins.delegateEvents('click a', callback);
                ins.$element.find('.btn').click();
                expect(callback.callCount).to.equal(1);
                ins.destroy();
            });
            it('delegateEvents({eventKey, handler}) works well', function() {
                var ins = new MyWidget({
                });
                var callback = sinon.spy();
                ins.delegateEvents({'click a': callback, 'click .btn': callback});
                ins.$element.find('.btn').click();
                expect(callback.callCount).to.equal(2);
                ins.destroy();
            });
            it('delegateEvents(element, eventKey, handler) works well', function() {
                var ins = new MyWidget({
                });
                var callback = sinon.spy();
                ins.delegateEvents('#btn', 'click', callback);
                $('#btn').click();
                expect(callback.callCount).to.equal(1);
                ins.destroy();
            });
            it('delegateEvents(element, {eventKey: handler}) works well', function() {
                var ins = new MyWidget({
                });
                var callback = sinon.spy();
                ins.delegateEvents('#btn', {'click': callback});
                $('#btn').click();
                expect(callback.callCount).to.equal(1);
                ins.destroy();
            });
            it('undelegateEvents() works well', function() {
                var ins = new MyWidget({
                });
                var callback = sinon.spy();
                ins.delegateEvents({'click .btn': callback});
                ins.delegateEvents('#btn', {'click': callback});
                $('#btn').click();
                ins.$element.find('.btn').click();
                expect(callback.callCount).to.equal(2);
                ins.undelegateEvents();
                $('#btn').click();
                ins.$element.find('.btn').click();
                expect(callback.callCount).to.equal(2);
                ins.destroy();
            });
            it('undelegateEvents(element) works well', function() {
                var ins = new MyWidget({
                });
                var callback = sinon.spy();
                ins.delegateEvents('#btn', {'click': callback});
                $('#btn').click();
                expect(callback.callCount).to.equal(1);
                ins.undelegateEvents('#btn');
                $('#btn').click();
                expect(callback.callCount).to.equal(1);
                ins.destroy();
            });
            it('undelegateEvents(element, eventKey) works well', function() {
                var ins = new MyWidget({
                });
                var callback = sinon.spy();
                ins.delegateEvents('#btn', {'click': callback});
                $('#btn').click();
                expect(callback.callCount).to.equal(1);
                ins.undelegateEvents('#btn', 'click');
                $('#btn').click();
                expect(callback.callCount).to.equal(1);
                ins.destroy();
            });
            it('undelegateEvents(eventKey) works well', function() {
                var ins = new MyWidget({
                });
                var callback = sinon.spy();
                ins.delegateEvents({'click .btn': callback});
                ins.$element.find('.btn').click();
                expect(callback.callCount).to.equal(1);
                ins.undelegateEvents('click .btn');
                ins.$element.find('.btn').click();
                expect(callback.callCount).to.equal(1);
                ins.destroy();
            });
        });
    });
});
