var delta = 1;

// 加减分
$('.team-list').on('click', '.action-wrap a', function(e) {
    e.preventDefault();

    var ele = $(this);
    var scoreNumEle = ele.parents('li').find('.score-num');
    var val = parseInt(scoreNumEle.html());

    // 新增
    if(ele.hasClass('add')) {
        val += delta;
    } else {
        val -= delta;
    }

    if(val >= 0) {
        if(val < 10) {
            val = '0' + val;
        }
    }
    scoreNumEle.html(val);
});

var dialog = $('.dialog');

// setting
$('.btn-set').on('click', function(e) {
    e.preventDefault();
    dialog.show();
});

$('.btn-cancel').on('click', function(e) {
    e.preventDefault();
    dialog.hide();
});

$('.btn-confirm').on('click', function(e) {
    e.preventDefault();
    var d = parseInt($('.delta-input').val());
    if(d && d > 0) {
        delta = d;
    }
    dialog.hide();
});
