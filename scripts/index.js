/**
 * Rubric Editor library
 */

var H5PEditor = H5PEditor || {};

H5PEditor.widgets.Rubric = H5PEditor.Rubric = (function($) {
  /**
   * Constructor function
   * @param       {object}   parent   Parent representation
   * @param       {object}   field    Field structure representation
   * @param       {mixed}    params   Array of stored data or undefined
   * @param       {function} setValue Value storage callback
   * @constructor
   */
  function Rubric(parent, field, params, setValue) {
    this.parent = parent;
    this.field = field;
    this.params = params;
    this.setValue = setValue;
  }

  /**
   * Builds the DOM objects and appends to the $wrapper
   * Also deals with setup of listeners and event handlers
   * @param  {object} $wrapper DOM node of container element
   * @return {void}
   */
  Rubric.prototype.appendTo = function($wrapper) {
    var self = this;

    self.$container = $('<div>', {
      'class': 'field field-name-' + self.field.name + ' h5p-grid-rubric group'
    });
  };

  /**
   * Runs before page is saved, makes sure the values are stored.
   * Sets value to undefined, if data is missing.
   * Does not really do any validation.
   * @return {boolean} Always returns true
   */
  Rubric.prototype.validate = function() {
    // TODO Make sure that this function does really save something
    this.setValue(this.field, undefined);
    return true;
  };

  /**
   * Handles element removal
   * @return {void}
   */
  Rubric.prototype.remove = function() {
    $wrapper.remove();
  };

  return Rubric;
})(H5P.jQuery);
