#Calendar

日历组件

## Demo
**注意：**PC用户请使用开发者工具模拟Touch行为
<link rel="stylesheet" href="http://s1.qhimg.com/!1d9bad0a/calendar-onebox.css" />
<style type="text/css">
    #demo-calendar table {
        margin: 0;
    }
    #demo-calendar th {
        padding: 0;
    }
    #demo-calendar td {
        padding: 0;
    }
</style>

<!-- HTML 结构 -->
<div class="section">
    <div id="demo-calendar"></div>
</div>

<!-- Javascript -->
<script type="text/javascript">
_loader.add('widget', 'http://s1.qhimg.com/static/c8b7de8c67377042/widget.1.0.2.js');
_loader.add('calendar', 'http://s0.qhimg.com/!da923eed/calendar.1.0.1.js');
_loader.use('widget, calendar', function() { 
    var calendar = new Calendar({
        element: '#demo-calendar',
        swipeable: true
    });
});
</script>

## 使用方法

### HTML

```markup
<div class="section">
    <div id="calendar"></div>
</div>
```

### Javascript
```markup
<script type="text/javascript" src="http://s1.qhimg.com/static/c8b7de8c67377042/widget.1.0.2.js"></script>
<script type="text/javascript" src="http://s0.qhimg.com/!da923eed/calendar.1.0.1.js"></script>
<script type="text/javascript">
    var calendar = new Calendar({
        element: '#calendar',
        swipeable: true
    });
</script>
```
### CSS
```markup
<link rel="stylesheet" href="http://s3.qhimg.com/!0eb306d2/calendar-onebox.css" />
```
使用默认样式，请引入以上文件。若需自定义样式，可按类名自定义。

## 配置

```javascript
var config = {
    element: '#calendar'                // Calendar元素选择器
    date: null,                         // 初始化日期，若为null则默认今天
    firstDay: 1,                        // 新的一周从星期几开始，0为星期天，1为星期一
    maxDate: null,                      // 最大日期, 可传入时间戳或'2014-01-01'格式
    minDate: null,                      // 最小日期, 可传入时间戳或'2014-01-01'格式
    swipeable: false,                   // 是否可左右滑动
    monthChangeable: false,             // 月份是否可选
    yearChangeable: false               // 年份是否可选
};  
```

##方法

```javascript

/*
 * 切换到今天所在月份
 */
function switchToToday() { //... }

/*
 * 切换年月
 * @param month{String, Number} 
 *      目标月份，值可以为1~12，或'-1M', '+4M'等。'+1M'表示在显示的月的基础上显示上一个月。
 * @param year{String, Number} 目标年份
 *      目标年份，值可以为2014格式的正整数，或'-5Y', '+1Y'等。'-5Y'表示相对当前年份的5年前。
 * @return this 组件实例本身 
 */
function switchMonthTo(month, year) { //... }

/*
 * 刷新日历
 * 修改配置后需调用此方法 
 * @return this 组件实例本身 
 */
function refresh() { //... }

/*
 * 销毁组件
 */
function destroy() { //... }

/*
 * 设置/获取maxDate
 * 想要设置生效需调用refresh方法
 * @param date{String, Number} 最大日期, 格式为'2014-01-01'或时间戳
 * @return this/maxDate 若传入参数date为空，则返回当前最大日期，否则返回组件实例
 */
function maxDate(date) { //... }

/*
 * 设置/获取minDate
 * 想要设置生效需调用refresh方法
 * @param date{String} 最小日期, 格式为'2014-01-01'或时间戳 
 * @return this/minDate 若传入参数date为空，则返回当前最小日期，否则返回组件实例
 */
function minDate(date) { //... }

/*
 * 设置/获取当前日期
 * 想要设置生效需调用refresh方法
 * @param date{String} 当前日期, 格式为'2014-01-01'或时间戳
 * @return this/date 若传入参数date为空，则返回当前日期，否则返回组件实例
 */
function date(date) { //... }

/*
 * 设置/获取当前选中日期
 * 想要设置生效需调用refresh方法
 * @param date{String} 当前选中日期, 格式为'2014-01-01'或时间戳
 * @return this/selectedDate 若传入参数date为空，则返回当前选中日期，否则返回组件实例
 */
function selectedDate(date) { //... }

```

## 扩展

### 事件

| 事件名 | 描述 |
| ---- | ---- |  
| ready | 当组件初始化完后触发。 | 
| select | 选中日期的时候触发 | 
| monthchange | 当前显示月份发生变化时触发 | 
| destroy | 组件在销毁的时候触发 | 

```javascript

/*
 * 选中事件回调函数说明
 * @param e{Object} Event对象
 * @param date{Number} 当前选中日期的时间戳
 * @param dateStr{String} 当前选中日期格式化字符串
 * @param instance{Object} 当前日历实例
 */
calendar.on('select', function(e, date, dateStr, instance) {
    // ...
});

/*
 * 月份更改事件回调函数说明
 * @param e{Object} Event对象
 * @param month{Number} 当前月份
 * @param year{String} 当前年份
 * @param instance{Object} 当前日历实例
 */
calendar.on('monthchange', function(e, month, year, instance) {
    // ...
});

```

## 日志

1.0.1 升级依赖widget.js版本为1.0.2

1.0.0 首次发布

