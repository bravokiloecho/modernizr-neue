'use strict';
var React = require('react/addons');
var PureRenderMixin = React.addons.PureRenderMixin;
var Detect = React.createFactory(require('./Detect'));
var DOM = React.DOM, ul = DOM.ul, li = DOM.li;
var DetectList = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return {};
  },

  keyDown: function(e, currentIndex) {
    var charCode = e.which;
    //              up arrow || J
    var UP = charCode === 38 || charCode === 75;
    //              down arrow || K
    var DOWN = charCode === 40 || charCode === 74;

    if ((UP || DOWN) && !e.meta) {
      var offset = UP ? -1 : 1;

      var nextRef = Math.max(0, Math.min(currentIndex + offset, this.props.detects.length));
      if (nextRef !== currentIndex) {
        this.refs[currentIndex].refs.option.refs.input.getDOMNode().blur();
        this.refs[nextRef].refs.option.refs.input.getDOMNode().focus();
      }
      e.preventDefault();
    }
  },

  focus: function(property) {
    this.setState({focused: property});
  },

  blur: function(property) {
    if (this.state.focused === property) {
      this.setState({focused: undefined});
    }
  },

  render: function() {
    var detects = this.props.detects;
    var select = this.props.select;
    var state = this.state;
    var self = this;

    detects = _.map(detects, function(detect, i) {
      var property = detect.property;
      var expanded;

      if (property === state.focused) {
        expanded = true;
      }

      return Detect({
        ref: i,
        index: i,
        expanded: expanded,
        key: property,
        data: detect,
        select: select,
        focus: self.focus,
        blur: self.blur,
        keyDown: self.keyDown
      }, detect.name);
    });

    detects = detects.length ? detects : li({className: 'detect option none'}, ':[ no such luck...');

    return ul({className: 'detects'}, detects);
  }
});

module.exports = DetectList;
