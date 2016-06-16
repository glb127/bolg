'use strict';

/**
 * @version 2.0.0
 * @date November 10, 2015
 * @modify January 26, 2016
 *
 * @description
 * drag vernier
 *
 * @requires d3.js
 *
 * @param {string} id - The id of node to append svg.
 * @param {Array} data - Custom error constructor to be instantiated when returning.
 * @param {number=} [width=300] - Width of vernier bar. Default as 300 if not set.
 * @param {number=} [min=0] - Minimum value of vernier scope. Default as 0.
 * @param {number=} [max=0] - Maximum value of vernier scope. Default as 100.
 * @param {number=} [interval=1] - interval.
 * @returns {Array}
 */

// TODO(sarah): directive, multi-color, background images, return data
function vernier(id, data, width, min, max, interval) {
    $('#'+id).empty();

    interval = interval?interval:1;
    data = data[0]?data:[0];
    width = width?width:300;
    min = min?min:0;
    max = max?max:100;
    var ratio = width/(max-min);
    var returnData = data;

    var svgPos = {height: 35, width: width+100},
        barPos = {x:10, y:8, height:4, width:width+interval*ratio},
        vernierPos = {y:0, innerRadius: 6, radius: 7};
    //var vernierGroupPos = {x:vernierPos.radius+1, y:barPos.y+barPos.height/2};
    var vernierGroupPos = {x:10, y:barPos.y+barPos.height/2};

    var vernierPosX = [];
    for(var i=0; i<data.length; i++) {
        vernierPosX.push({x:data[i]*ratio});
    }

    function dragStart() {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed('dragging', true);
    }

    function dragEnd(d, i) {    //
        d3.select(this).classed('dragging', false);
        var textNode = this.nextElementSibling || this.nextSibling;
        returnData[i] = Number(textNode.textContent);
    }

    //TODO recalculate
    function dragging(d, i) {
        var currentDotPos = d3.event.x;
        var minX = i ? vernierPosX[i-1].x : 0,
            maxX = (i==vernierPosX.length-1) ? width+interval*ratio : vernierPosX[i+1].x;
        if( currentDotPos < maxX-interval*ratio && currentDotPos > minX+interval*ratio ) {
            d3.select(this).attr('cx', d.x = currentDotPos);
            var currentNum = Math.floor(currentDotPos/ratio);
            var textNode = this.nextElementSibling || this.nextSibling;     //一入前门深似海
            d3.select(textNode).attr('x', d.x-vernierPos.radius).text(currentNum-currentNum%interval);

            //console.log('current dot pos: %d; current number: %d; current text: %d   ----------  max x: %d; max x: %d',currentDotPos,currentNum,(currentNum-currentNum%interval),maxX,(maxX-interval*ratio));
        }
    }

    var drag = d3.behavior.drag()
        .origin(function(d) { return d; })
        .on('dragstart', dragStart)
        .on('drag', dragging)
        .on('dragend', dragEnd);

    var svg = d3.select('#'+id).append('svg')
        .attr('class', 'vernier')
        .attr('width', svgPos.width)
        .attr('height', svgPos.height);

    //标尺
    var bar = svg.append('g')
        .attr('class', 'vernierBar')
        .attr('transform', 'translate(' + barPos.x + ',' + barPos.y + ')');

    bar.append('rect')
        //.attr('width', barPos.width + 2*vernierPos.radius + 2)
        .attr('width', barPos.width)
        .attr('height', barPos.height)
        .attr('rx', barPos.height/2)
        .style('pointer-events', 'all');

    bar.append('text')
        //.attr('transform', 'translate(' + (barPos.x) + ',' + 26 + ')')
        .attr('transform', 'translate(' + (-10) + ',' + 26 + ')')
        .attr('class', 'barText')
        .text(min);

    bar.append('text')
        .attr('transform', 'translate(' + (barPos.x+barPos.width-10) + ',' + 26 + ')')
        .attr('class', 'barText')
        .text(max);

    //游标
    var vernierDotGroup = svg.append('g')
        .attr('class', 'vernierDotGroup')
        .attr('transform', 'translate(' + vernierGroupPos.x + ',' + vernierGroupPos.y + ')');

    //游标位置
    var vernierDots = vernierDotGroup.selectAll('g')
        .data(vernierPosX)
        .enter().append('g')
        .attr('class', 'vernierDot')
        .attr('x', function(d) { return d.x; })
        .attr('y', vernierPos.y);

    //游标的点点
    vernierDots.append('circle')
        .attr('r', vernierPos.radius)
        .attr('cx', function(d) { return d.x; })
        .attr('cy', vernierPos.y);

    //游标的刻度
    vernierDots.append('text')
        .attr('x', function(d) { return d.x-vernierPos.radius; })
        .attr('y', vernierPos.y+2*vernierPos.radius+10)
        .text(function(d){return d.x/ratio;});

    vernierDotGroup.selectAll('g').select('circle').call(drag);
    return returnData;
}

function vernierRiskLevel(id, data, width, min, max, interval, textData) {
    $('#'+id).empty();

    interval = interval?interval:1;
    data = data[0]?data:[0];
    width = width?width:300;
    min = min?min:0;
    max = max?max:100;
    var ratio = width/(max-min);
    var returnData = data;

    var svgPos = {height: 60, width: width+100},
        barPos = {x:10, y:33, height:4, width:width+interval*ratio},
        vernierPos = {y:0, innerRadius: 6, radius: 7},
        textPos = {x:10, y:0, height:17, width:60};
    //var vernierGroupPos = {x:vernierPos.radius+1, y:barPos.y+barPos.height/2};
    var vernierGroupPos = {x:10, y:barPos.y+barPos.height/2},
        vernierTextGroupPos = {x:10, y:0};

    //存游标尺端点及4个游标的位置
    var pos = [0, 0, 0, 0, 0, width+interval*ratio];

    //游标上点点的x轴位置
    var vernierPosX = [];
    for(var i=0; i<data.length; i++) {
        vernierPosX.push({x:data[i]*ratio});
    }

    //提示文字的x轴位置
    var textPosX = [];
    textPosX.push({x:data[0]/2*ratio, text:textData[0]});
    for(var i=0; i<textData.length-2; i++) {
        textPosX.push({x:((data[i+1]-data[i])/2+data[i])*ratio, text:textData[i+1]});
    }
    textPosX.push({x:((max-data[data.length-1])/2+data[data.length-1])*ratio, text:textData[textData.length-1]});
    console.log(textPosX);

    function dragStart() {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed('dragging', true);
    }

    function dragEnd(d, i) {    //
        d3.select(this).classed('dragging', false);
        var textNode = this.nextElementSibling || this.nextSibling;
        returnData[i] = Number(textNode.textContent);
    }

    //TODO recalculate
    function dragging(d, i) {
        var currentDotPos = d3.event.x;
        pos[i+1] = currentDotPos;
        var minX = i ? vernierPosX[i-1].x : 0,
            maxX = (i==vernierPosX.length-1) ? width+interval*ratio : vernierPosX[i+1].x;
        if( currentDotPos < maxX-interval*ratio && currentDotPos > minX+interval*ratio ) {
            d3.select(this).attr('cx', d.x = currentDotPos);
            var currentNum = Math.floor(currentDotPos/ratio);

            var textNode = this.nextElementSibling || this.nextSibling;
            d3.select(textNode).attr('x', d.x-vernierPos.radius).text(currentNum-currentNum%interval);

            //前一区间的提示文字
            var preTipRectNode = document.getElementById('riskLevelVernierText'+i);
            var preTipTextNode = preTipRectNode.nextElementSibling || preTipRectNode.nextSibling;
            var preTipLineNode = preTipTextNode.nextElementSibling || preTipTextNode.nextSibling;
            d3.select(preTipRectNode).attr('x', (pos[i+1]-pos[i])/2+pos[i]-textPos.width/2);
            d3.select(preTipTextNode).attr('x', (pos[i+1]-pos[i])/2+pos[i]-textPos.width/3);
            d3.select(preTipLineNode).attr('x', (pos[i+1]-pos[i])/2+pos[i]);
            //console.log(pos);

            //后一区间的提示文字
            var nextTipRectNode = document.getElementById('riskLevelVernierText'+(i+1));
            var nextTipTextNode = nextTipRectNode.nextElementSibling || nextTipRectNode.nextSibling;
            var nextTipLineNode = nextTipTextNode.nextElementSibling || nextTipTextNode.nextSibling;
            d3.select(nextTipRectNode).attr('x', (pos[i+2]-pos[i+1])/2+pos[i+1]-textPos.width/2);
            d3.select(nextTipTextNode).attr('x', (pos[i+2]-pos[i+1])/2+pos[i+1]-textPos.width/3);
            d3.select(nextTipLineNode).attr('x', (pos[i+2]-pos[i+1])/2+pos[i+1]);
        }
    }

    var drag = d3.behavior.drag()
        .origin(function(d) { return d; })
        .on('dragstart', dragStart)
        .on('drag', dragging)
        .on('dragend', dragEnd);

    var svg = d3.select('#'+id).append('svg')
        .attr('class', 'vernier')
        .attr('width', svgPos.width)
        .attr('height', svgPos.height);

    //标尺
    var bar = svg.append('g')
        .attr('class', 'vernierBar')
        .attr('transform', 'translate(' + barPos.x + ',' + barPos.y + ')');

    bar.append('rect')
        //.attr('width', barPos.width + 2*vernierPos.radius + 2)
        .attr('width', barPos.width)
        .attr('height', barPos.height)
        .attr('rx', barPos.height/2)
        .style('pointer-events', 'all');

    bar.append('text')
        //.attr('transform', 'translate(' + (barPos.x) + ',' + 26 + ')')
        .attr('transform', 'translate(' + (-10) + ',' + 26 + ')')
        .attr('class', 'barText')
        .text('1');

    bar.append('text')
        .attr('transform', 'translate(' + (barPos.x+barPos.width-10) + ',' + 26 + ')')
        .attr('class', 'barText')
        .text(max);


    //提示文字
    var vernierTextGroup = svg.append('g')
        .attr('class', 'vernierTextGroup')
        .attr('transform', 'translate(' + vernierTextGroupPos.x + ',' + vernierTextGroupPos.y + ')');

    //提示文字位置
    var vernierTexts = vernierTextGroup.selectAll('g')
        .data(textPosX)
        .enter().append('g')
        .attr('class', 'vernierText')
        .attr('x', function(d) { return d.x; })
        .attr('y', textPos.y);

    //提示文字的框框
    vernierTexts.append('rect')
        .attr('width', textPos.width)
        .attr('height', textPos.height)
        .attr('rx', textPos.height/2)
        .attr('x', function(d) { return d.x-textPos.width/2; })
        .attr('y', 0)
        .attr('id', function(d, i) { return 'riskLevelVernierText'+ i; })
        .style('pointer-events', 'all');

    //提示文字的文字
    vernierTexts.append('text')
        .attr('x', function(d) { return d.x-textPos.width/3; })
        .attr('y', 14)
        .text(function(d){return d.text;});

    //框框和游标尺的连接线
    vernierTexts.append('rect')
        .attr('width', 2)
        .attr('height', 17)
        .attr('x', function(d) { return d.x; })
        .attr('y', 17)
        .style('pointer-events', 'all');


    //游标
    var vernierDotGroup = svg.append('g')
        .attr('class', 'vernierDotGroup')
        .attr('transform', 'translate(' + vernierGroupPos.x + ',' + vernierGroupPos.y + ')');

    //游标位置
    var vernierDots = vernierDotGroup.selectAll('g')
        .data(vernierPosX)
        .enter().append('g')
        .attr('class', 'vernierDot')
        .attr('x', function(d) { return d.x; })
        .attr('y', vernierPos.y);

    //游标的点点
    vernierDots.append('circle')
        .attr('r', vernierPos.radius)
        .attr('cx', function(d, i) { pos[i+1]= d.x; return d.x; })
        .attr('cy', vernierPos.y);

    //游标的刻度
    vernierDots.append('text')
        .attr('x', function(d) { return d.x-vernierPos.radius; })
        .attr('y', vernierPos.y+2*vernierPos.radius+10)
        .text(function(d){return d.x/ratio;});

    vernierDotGroup.selectAll('g').select('circle').call(drag);
    return returnData;
}

function vernierRiskDeal(id, data, width, min, max, interval, textData) {
    $('#'+id).empty();

    interval = interval?interval:1;
    data = data[0]?data:[0];
    width = width?width:300;
    min = min?min:0;
    max = max?max:100;
    var ratio = width/(max-min);
    var returnData = data;

    var svgPos = {height: 60, width: width+100},
        barPos = {x:10, y:33, height:4, width:width+interval*ratio},
        vernierPos = {y:0, innerRadius: 6, radius: 7},
        textPos = {x:10, y:0, height:17, width:40};
    var vernierGroupPos = {x:10, y:barPos.y+barPos.height/2},
        vernierTextGroupPos = {x:10, y:0};

    //存游标尺端点及1个游标的位置
    var pos = [0, 0, width+interval*ratio];

    //游标上点点的x轴位置
    var vernierPosX = [];
    for(var i=0; i<data.length; i++) {
        vernierPosX.push({x:data[i]*ratio});
    }

    //提示文字的x轴位置
    var textPosX = [];
    textPosX.push({x:data[0]/2*ratio, text:textData[0]});
    for(var i=0; i<textData.length-2; i++) {
        textPosX.push({x:((data[i+1]-data[i])/2+data[i])*ratio, text:textData[i+1]});
    }
    var tmpData = parseInt(data[data.length-1]);
    textPosX.push({x:((max-tmpData)/2+tmpData)*ratio, text:textData[textData.length-1]});

    function dragStart() {
        d3.event.sourceEvent.stopPropagation();
        d3.select(this).classed('dragging', true);
    }

    function dragEnd(d, i) {    //
        d3.select(this).classed('dragging', false);
        var textNode = this.nextElementSibling || this.nextSibling;
        returnData[i] = Number(textNode.textContent);
    }

    //TODO recalculate
    function dragging(d, i) {
        var currentDotPos = d3.event.x;
        pos[i+1] = currentDotPos;
        var minX = i ? vernierPosX[i-1].x : 0,
            maxX = (i==vernierPosX.length-1) ? width+interval*ratio : vernierPosX[i+1].x;
        if( currentDotPos < maxX-interval*ratio && currentDotPos > minX+interval*ratio ) {
            d3.select(this).attr('cx', d.x = currentDotPos);
            var currentNum = Math.floor(currentDotPos/ratio);

            var textNode = this.nextElementSibling || this.nextSibling;
            d3.select(textNode).attr('x', d.x-vernierPos.radius).text(currentNum-currentNum%interval);

            //前一区间的提示文字
            var preTipRectNode = document.getElementById('riskDealVernierText'+i);
            var preTipTextNode = preTipRectNode.nextElementSibling || preTipRectNode.nextSibling;
            var preTipLineNode = preTipTextNode.nextElementSibling || preTipTextNode.nextSibling;
            d3.select(preTipRectNode).attr('x', (pos[i+1]-pos[i])/2+pos[i]-textPos.width/2);
            d3.select(preTipTextNode).attr('x', (pos[i+1]-pos[i])/2+pos[i]-textPos.width/3);
            d3.select(preTipLineNode).attr('x', (pos[i+1]-pos[i])/2+pos[i]);

            //后一区间的提示文字
            var nextTipRectNode = document.getElementById('riskDealVernierText'+(i+1));
            var nextTipTextNode = nextTipRectNode.nextElementSibling || nextTipRectNode.nextSibling;
            var nextTipLineNode = nextTipTextNode.nextElementSibling || nextTipTextNode.nextSibling;
            d3.select(nextTipRectNode).attr('x', (pos[i+2]-pos[i+1])/2+pos[i+1]-textPos.width/2);
            d3.select(nextTipTextNode).attr('x', (pos[i+2]-pos[i+1])/2+pos[i+1]-textPos.width/3);
            d3.select(nextTipLineNode).attr('x', (pos[i+2]-pos[i+1])/2+pos[i+1]);
        }
    }

    var drag = d3.behavior.drag()
        .origin(function(d) { return d; })
        .on('dragstart', dragStart)
        .on('drag', dragging)
        .on('dragend', dragEnd);

    var svg = d3.select('#'+id).append('svg')
        .attr('class', 'vernier')
        .attr('width', svgPos.width)
        .attr('height', svgPos.height);

    //标尺
    var bar = svg.append('g')
        .attr('class', 'vernierBar')
        .attr('transform', 'translate(' + barPos.x + ',' + barPos.y + ')');

    bar.append('rect')
        //.attr('width', barPos.width + 2*vernierPos.radius + 2)
        .attr('width', barPos.width)
        .attr('height', barPos.height)
        .attr('rx', barPos.height/2)
        .style('pointer-events', 'all');

    bar.append('text')
        //.attr('transform', 'translate(' + (barPos.x) + ',' + 26 + ')')
        .attr('transform', 'translate(' + (-10) + ',' + 26 + ')')
        .attr('class', 'barText')
        .text(min);

    bar.append('text')
        .attr('transform', 'translate(' + (barPos.x+barPos.width-10) + ',' + 26 + ')')
        .attr('class', 'barText')
        .text(max);


    //提示文字
    var vernierTextGroup = svg.append('g')
        .attr('class', 'vernierTextGroup')
        .attr('transform', 'translate(' + vernierTextGroupPos.x + ',' + vernierTextGroupPos.y + ')');

    //提示文字位置
    var vernierTexts = vernierTextGroup.selectAll('g')
        .data(textPosX)
        .enter().append('g')
        .attr('class', 'vernierText')
        .attr('x', function(d) { return d.x; })
        .attr('y', textPos.y);

    //提示文字的框框
    vernierTexts.append('rect')
        .attr('width', textPos.width)
        .attr('height', textPos.height)
        .attr('rx', textPos.height/2)
        .attr('x', function(d) { return d.x-textPos.width/2; })
        .attr('y', 0)
        .attr('id', function(d, i) { return 'riskDealVernierText'+ i; })
        .style('pointer-events', 'all');

    //提示文字的文字
    vernierTexts.append('text')
        .attr('x', function(d) { return d.x-textPos.width/3; })
        .attr('y', 14)
        .text(function(d){return d.text;});

    //框框和游标尺的连接线
    vernierTexts.append('rect')
        .attr('width', 2)
        .attr('height', 17)
        .attr('x', function(d) { return d.x; })
        .attr('y', 17)
        .style('pointer-events', 'all');


    //游标
    var vernierDotGroup = svg.append('g')
        .attr('class', 'vernierDotGroup')
        .attr('transform', 'translate(' + vernierGroupPos.x + ',' + vernierGroupPos.y + ')');

    //游标位置
    var vernierDots = vernierDotGroup.selectAll('g')
        .data(vernierPosX)
        .enter().append('g')
        .attr('class', 'vernierDot')
        .attr('x', function(d) { return d.x; })
        .attr('y', vernierPos.y);

    //游标的点点
    vernierDots.append('circle')
        .attr('r', vernierPos.radius)
        .attr('cx', function(d, i) { pos[i+1]= d.x; return d.x; })
        .attr('cy', vernierPos.y);

    //游标的刻度
    vernierDots.append('text')
        .attr('x', function(d) { return d.x-vernierPos.radius; })
        .attr('y', vernierPos.y+2*vernierPos.radius+10)
        .text(function(d){return d.x/ratio;});

    vernierDotGroup.selectAll('g').select('circle').call(drag);
    return returnData;
}