/**
 * @description
 * 首页风险占比环形图
 *
 * DONE, YEAH!!!
 *
 * @require
 * d3
 *
 * @example
 <div style="background-color: #11a7d6">
 <div id='riskUserProportionArc'></div>
 <div id='riskTransactionProportionArc'></div>
 </div>
 */

var riskUserData = [25, 75],
    riskUserProportion = 0.75;  //风险用户占比

var riskTransactionData = [45, 55],
    riskTransactionProportion = 0.55;   //风险交易占比

var transparent_white_light = 'rgba(255,255,255,0.2)';  //background color of doughnut chart
var transparent_white_dark = 'rgba(255, 255, 255, 0.8)';    //data color of doughnut chart
var τ = 2 * Math.PI;

var width = 200,
    height = 200,
    radius = height / 2;

//背景圆弧
var bgArc = d3.svg.arc()
    .innerRadius(radius - 12)
    .outerRadius(radius)
    .startAngle(0);

//表示占比数的圆弧
var fgArc = d3.svg.arc()
    .innerRadius(radius - 10)
    .outerRadius(radius - 2)
    .cornerRadius(20)
    .startAngle(0);

//风险用户svg
var riskUserSvg = d3.select("#riskUserProportionArc").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//风险用户占比：背景
var riskUserBg = riskUserSvg.append("path")
    .datum({endAngle: τ})
    .style("fill", transparent_white_light)
    .attr("d", bgArc);

//风险用户占比：前景
var riskUserFg = riskUserSvg.append("path")
    .datum({endAngle: 0.1})
    .style("fill", transparent_white_dark)
    .attr("d", fgArc);

//风险交易svg
var riskTransactionSvg = d3.select("#riskTransactionProportionArc").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//风险交易占比：背景
var riskTransactionBg = riskTransactionSvg.append("path")
    .datum({endAngle: τ})
    .style("fill", transparent_white_light)
    .attr("d", bgArc);

//风险交易占比：前景
var riskTransactionFg = riskTransactionSvg.append("path")
    .datum({endAngle: 0.1})
    .style("fill", transparent_white_dark)
    .attr("d", fgArc);

//圆弧角度变化动画
function changeAngle(path, endAngle) {
    path.transition()
        .duration(750)
        .attrTween("d", function (d) {
            var interpolate = d3.interpolate(d.endAngle, endAngle);
            return function (t) {
                d.endAngle = interpolate(t);
                return fgArc(d);
            };
        });
}

//风险用户占比环形图动画
changeAngle(riskUserFg, riskUserProportion * τ);

//风险交易占比环形图动画
changeAngle(riskTransactionFg, riskTransactionProportion * τ);
