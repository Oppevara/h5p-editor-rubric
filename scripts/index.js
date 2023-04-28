/**
 * Rubric Editor library
 */

var H5PEditor = H5PEditor || {};

H5PEditor.widgets.rubric = H5PEditor.Rubric = (function ($, JoubelUI) {
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

    this.presetDefaultValues();
  }

  /**
   * Preset default values if empty
   * @return {void}
   */
  Rubric.prototype.presetDefaultValues = function () {
    if (!(this.params && typeof this.params === 'object')) {
      this.params = {
        rows: [
          {
            rowId: H5P.createUUID(),
            rowText: H5PEditor.t('H5PEditor.Rubric', 'criteriaTopic', {}),
            columns: []
          },
          {
            rowId: H5P.createUUID(),
            rowText: H5PEditor.t('H5PEditor.Rubric', 'criteriaTopic', {}),
            columns: []
          },
          {
            rowId: H5P.createUUID(),
            rowText: H5PEditor.t('H5PEditor.Rubric', 'criteriaTopic', {}),
            columns: []
          }
        ],
        columns: [
          {
            columnId: H5P.createUUID(),
            columnText: H5PEditor.t('H5PEditor.Rubric', 'proficient', {})
          },
          {
            columnId: H5P.createUUID(),
            columnText: H5PEditor.t('H5PEditor.Rubric', 'emerging', {})
          },
          {
            columnId: H5P.createUUID(),
            columnText: H5PEditor.t('H5PEditor.Rubric', 'beginning', {})
          }
        ]
      };
    }
  };

  /**
   * Tries to find element index within an array.
   * Uses native Array._findIndex, if available.
   * Uses abstract comparison operator (e.g. ==).
   * @param  {array} elements An array of objects
   * @param  {mixed} key      Key to use for comparison
   * @param  {mixed} value    Value to use for comparison
   * @return {integer}        Element index or -1
   */
  Rubric.prototype._findIndex = function (elements, key, value) {
    if (!(elements && elements.length > 0)) {
      return -1;
    }

    if (typeof elements.findIndex === 'function') {
      return elements.findIndex(function (element) {
        return element[key] == value;
      });
    }

    for (var i = 0; i < elements.length; i++) {
      if (elements[i][key] == value) {
        return i;
      }
    }

    return -1;
  };

  /**
   * Tries to find element within an array.
   * Uses native Array.find, if available.
   * Uses abstract comparsion operator (e.g. ==).
   * @param  {array} elements An array ob objects
   * @param  {mixed} key      Key to use for comparison
   * @param  {mixed} value    Value to use for comparison
   * @return {object}         Element or undefined
   */
  Rubric.prototype._find = function (elements, key, value) {
    if (!(elements && elements.length > 0)) {
      return undefined;
    }

    if (typeof elements.find === 'function') {
      return elements.find(function (element) {
        return element[key] == value;
      });
    }

    for (var i = 0; i < elements.length; i++) {
      if (elements[i][key] == value) {
        return elements[i];
      }
    }

    return undefined;
  };

  /**
   * Returns columns based on the data object
   * @return {array} An array column objects
   */
  Rubric.prototype.getColumns = function () {
    return this.params.columns;
  };

  /**
   * Returns column index
   * @param  {object} column Column object
   * @return {integer}       Index or -1
   */
  Rubric.prototype.findColumnIndex = function (column) {
    return this._findIndex(this.getColumns(), 'columnId', column.columnId);
  };

  /**
   * Returns rows based on the data object
   * @return {array} An array of row objects
   */
  Rubric.prototype.getRows = function () {
    return this.params.rows;
  };

  /**
   * Returns row index
   * @param  {object} row Row object
   * @return {integer}    Index or -1
   */
  Rubric.prototype.findRowIndex = function (row) {
    return this._findIndex(this.getRows(), 'rowId', row.rowId);
  };

  /**
   * Returns text for columns within a row
   * @param  {object} row     Row object
   * @param  {object} column Column object
   * @return {string}        Value or an empty string
   */
  Rubric.prototype.getRowColumnText = function (row, column) {
    var text = '';

    if (row && Object.prototype.hasOwnProperty.call(row, 'columns') && row.columns.length > 0) {
      var found = this._find(row.columns, 'columnId', column.columnId);

      if (found && Object.prototype.hasOwnProperty.call(found, 'text')) {
        return found.text;
      }
    }

    return text;
  };

  /**
   * Returns DOM Nodes for column heading buttons
   * @param  {object} column Column object
   * @return {array}         An array of DOM Nodes
   */
  Rubric.prototype.generateTableColumnHeadingButtonsHtml = function (column) {
    var self = this;
    return $('<div>', {
      'class': 'actions'
    }).append($('<div>', {
      'class': 'h5peditor-button move-left',
      'role': 'button',
      'tabindex': '-1',
      'aria-disabled': 'false',
      'aria-label': H5PEditor.t('H5PEditor.Rubric', 'moveLeft', {})
    }).append($('<i>', {
      'class': 'fa fa-arrow-left',
      'aria-hidden': 'true'
    })).on('click', function () {
      self.moveColumnLeft(column);
    })).append($('<div>', {
      'class': 'h5peditor-button remove',
      'role': 'button',
      'tabindex': '-1',
      'aria-disabled': 'false',
      'aria-label': H5PEditor.t('H5PEditor.Rubric', 'remove', {})
    }).append($('<i>', {
      'class': 'fa fa-times',
      'aria-hidden': 'true'
    })).on('click', function () {
      self.removeColumn(column);
    })).append($('<div>', {
      'class': 'h5peditor-button move-right',
      'role': 'button',
      'tabindex': '-1',
      'aria-disabled': 'false',
      'aria-label': H5PEditor.t('H5PEditor.Rubric', 'moveRight', {})
    }).append($('<i>', {
      'class': 'fa fa-arrow-right',
      'aria-hidden': 'true'
    })).on('click', function () {
      self.moveColumnRight(column);
    }));
  };

  /**
   * Returns DOM Nodes for row buttons
   * @param  {object} row Row object
   * @return {array}      An array of DOM Nodes
   */
  Rubric.prototype.generateTableRowButtonsHtml = function (row) {
    var self = this;
    return $('<div>', {
      'class': 'actions'
    }).append($('<div>', {
      'class': 'h5peditor-button move-up',
      'role': 'button',
      'tabindex': '-1',
      'aria-disabled': 'false',
      'aria-label': H5PEditor.t('H5PEditor.Rubric', 'moveUp', {})
    }).append($('<i>', {
      'class': 'fa fa-arrow-up',
      'aria-hidden': 'true'
    })).on('click', function () {
      self.moveRowUp(row);
    })).append($('<div>', {
      'class': 'h5peditor-button remove',
      'role': 'button',
      'tabindex': '-1',
      'aria-disabled': 'false',
      'aria-label': H5PEditor.t('H5PEditor.Rubric', 'remove', {})
    }).append($('<i>', {
      'class': 'fa fa-times',
      'aria-hidden': 'true'
    })).on('click', function () {
      self.removeRow(row);
    })).append($('<div>', {
      'class': 'h5peditor-button move-down',
      'role': 'button',
      'tabindex': '-1',
      'aria-disabled': 'false',
      'aria-label': H5PEditor.t('H5PEditor.Rubric', 'moveDown', {})
    }).append($('<i>', {
      'class': 'fa fa-arrow-down',
      'aria-hidden': 'true'
    })).on('click', function () {
      self.moveRowDown(row);
    }));
  };

  /**
   * Returns table row DOM Node
   * @param  {object} row Row object
   * @return {array}     An array with DOM Node
   */
  Rubric.prototype.generateTableRowHtml = function (row) {
    var self = this;
    var tr = $('<tr>', {
      'class': 'grid-row',
      'data-id': row.rowId
    });
    $('<td>', {}).append($('<input>', {
      type: 'text',
      class: 'h5peditor-text',
      value: row.rowText,
      placeholder: H5PEditor.t('H5PEditor.Rubric', 'criteriaTopic', {})
    })).append(this.generateTableRowButtonsHtml(row)).appendTo(tr);

    $.each(self.getColumns(), function (index, column) {
      tr.append(self.generateTableRowColumnHtml(column, row));
    });

    return tr;
  };

  /**
   * Returns table column heading DOM Node
   * @param  {object} column Column object
   * @return {array}         An array with DOM Node
   */
  Rubric.prototype.generateTableColumnHeadingHtml = function (column) {
    return $('<th>', {
      'class': 'grid-column',
      'data-id': column.columnId,
    }).append($('<input>', {
      type: 'text',
      class: 'h5peditor-text',
      value: column.columnText,
      placeholder: H5PEditor.t('H5PEditor.Rubric', 'columnHeading', {})
    })).append(this.generateTableColumnHeadingButtonsHtml(column));
  };

  /**
   * Returns table row column DOM Node
   * @param  {object} column Column object
   * @param  {object=} row   Row object (optional)
   * @return {array}        An array with DOM Node
   */
  Rubric.prototype.generateTableRowColumnHtml = function (column, row) {
    var text = '';

    if (row) {
      text = this.getRowColumnText(row, column);
    }

    return $('<td>', {
      'class': 'grid-row-column',
      'data-id': column.columnId
    }).append($('<textarea>', {
      rows: 4,
      placeholder: H5PEditor.t('H5PEditor.Rubric', 'editMe', {})
    }).val(text));
  };

  /**
   * Generates grid table and appends to responsive container
   * @return {void}
   */
  Rubric.prototype.createGrid = function () {
    var helpText = H5PEditor.t('H5PEditor.Rubric', 'helpText1', {});
    helpText += '<br><br>';
    helpText += H5PEditor.t('H5PEditor.Rubric', 'helpText2', {});
    helpText += '<br><br>';
    helpText += H5PEditor.t('H5PEditor.Rubric', 'helpText3', {});

    var self = this;
    var table = $('<table>', {
      'class': 'h5p-rubric grid'
    });
    $('<thead>').appendTo(table);
    $('<tr>').appendTo(table.find('thead'));
    $('<th>')
      .append(
        $('<a>', {
          'href': 'https://h5p.ee/h5p-mallid/rubric/',
          'class': 'help-button',
          'target': '_blank',
          'title': H5PEditor.t('H5PEditor.Rubric', 'additionalInformation', {}),
          'aria-disabled': 'false',
          'aria-label': H5PEditor.t('H5PEditor.Rubric', 'additionalInformation', {}),
          'on': {
            'click': function (event) {
              event.preventDefault();
              JoubelUI.createHelpTextDialog('Rubric', helpText)
                .getElement()
                .appendTo(self.$container);
            }
          }
        })
          .append('<i class="fa fa-question" aria-hidden="true"></i>')
      )
      .append(
        $('<a>', {
          'href': 'https://h5p.ee/h5p-mallid/rubric/',
          'class': 'help-button',
          'target': '_blank',
          'title': H5PEditor.t('H5PEditor.Rubric', 'contentHelpPage', {}),
          'aria-disabled': 'false',
          'aria-label': H5PEditor.t('H5PEditor.Rubric', 'contentHelpPage', {})
        })
          .append('<i class="fa fa-external-link" aria-hidden="true"></i>')
      )
      .appendTo(table.find('thead > tr'));

    $.each(self.getColumns(), function (index, column) {
      table.find('thead > tr').append(self.generateTableColumnHeadingHtml(column));
    });

    $('<tbody>').appendTo(table);

    $.each(self.getRows(), function (index, row) {
      table.find('tbody').append(self.generateTableRowHtml(row));
    });

    table.appendTo(this.$responsiveGridContainer);
  };

  /**
   * Creates buttons and appends to container
   * @return {void}
   */
  Rubric.prototype.createButtons = function () {
    var self = this;
    var $container = $('<div>');

    $('<div>', {
      'class': 'h5peditor-button h5peditor-button-textual',
      'role': 'button',
      'tabindex': '0',
      'aria-disabled': 'false',
      'text': H5PEditor.t('H5PEditor.Rubric', 'addRow', {})
    }).on('click', function () {
      self.addRow();
    }).appendTo($container);

    $('<div>', {
      'class': 'h5peditor-button h5peditor-button-textual',
      'role': 'button',
      'tabindex': '0',
      'aria-disabled': 'false',
      'text': H5PEditor.t('H5PEditor.Rubric', 'addColumn', {})
    }).on('click', function () {
      self.addColumn();
    }).appendTo($container);

    $container.appendTo(self.$container);
  };

  /**
   * Adds new column to both data object and DOM
   * @return {void}
   */
  Rubric.prototype.addColumn = function () {
    var column = {
      columnId: H5P.createUUID(),
      columnText: ''
    };
    var columns = this.getColumns();

    columns.push(column);
    this.$container.find('table.h5p-rubric > thead > tr').append(this.generateTableColumnHeadingHtml(column));
    this.$container.find('table.h5p-rubric > tbody > tr').append(this.generateTableRowColumnHtml(column));
  };

  /**
   * Adds new row ro both data object and DOM
   * @return {void}
   */
  Rubric.prototype.addRow = function () {
    var row = {
      rowId: H5P.createUUID(),
      rowText: ''
    };
    this.params.rows.push(row);
    this.$container.find('table.h5p-rubric > tbody').append(this.generateTableRowHtml(row));
  };

  /**
   * Moves column to the left, if possible.
   * In caae of rightmost column, action is ignored.
   * Operates both data object and DOM.
   * @param  {object} column Column object
   * @return {void}
   */
  Rubric.prototype.moveColumnLeft = function (column) {
    var index = this.findColumnIndex(column);

    if (index === 0) {
      return;
    }

    this.getColumns().splice(index, 1);
    this.getColumns().splice(index - 1, 0, column);
    var th = this.$container.find('table.h5p-rubric thead th[data-id="' + column.columnId + '"]');
    var prevTh = th.prev();
    th.detach().insertBefore(prevTh);
    this.$container.find('table.h5p-rubric > tbody td.grid-row-column[data-id="' + column.columnId + '"]').each(function (index, element) {
      var prevElement = $(element).prev();
      $(element).detach().insertBefore(prevElement);
    });
  };

  /**
   * Removes the column, if possible.
   * Last column is never removed, action is ignored.
   * Operates both data object and DOM.
   * @param  {object} column Column object
   * @return {void}
   */
  Rubric.prototype.removeColumn = function (column) {
    if (this.getColumns().length === 1) {
      return;
    }

    if (confirm(H5PEditor.t('H5PEditor.Rubric', 'deleteColumnConfirm', {}))) {
      var index = this.findColumnIndex(column);
      this.getColumns().splice(index, 1);
      this.$container.find('table.h5p-rubric > thead th.grid-column[data-id="' + column.columnId + '"]').remove();
      this.$container.find('table.h5p-rubric > tbody td.grid-row-column[data-id="' + column.columnId + '"]').remove();
    }
  };

  /**
   * Moves column if possible.
   * In case of leftmost column, action is ignored.
   * Operates both data object and DOM.
   * @param  {object} column Column object
   * @return {void}
   */
  Rubric.prototype.moveColumnRight = function (column) {
    var index = this.findColumnIndex(column);

    if (index === this.getColumns().length - 1) {
      return;
    }

    this.getColumns().splice(index, 1);
    this.getColumns().splice(index + 1, 0, column);
    var th = this.$container.find('table.h5p-rubric > thead th[data-id="' + column.columnId + '"]');
    var nextTh = th.next();
    th.detach().insertAfter(nextTh);
    this.$container.find('table.h5p-rubric > tbody td.grid-row-column[data-id="' + column.columnId + '"]').each(function (index, element) {
      var nextElement = $(element).next();
      $(element).detach().insertAfter(nextElement);
    });
  };

  /**
   * Moves row up if possible.
   * In case of topmost row, action is ignored.
   * Operates both data object and DOM.
   * @param  {object} row Row object
   * @return {void}
   */
  Rubric.prototype.moveRowUp = function (row) {
    var index = this.findRowIndex(row);

    if (index === 0) {
      return;
    }

    this.getRows().splice(index, 1);
    this.getRows().splice(index - 1, 0, row);
    var tr = this.$container.find('table.h5p-rubric > tbody tr.grid-row[data-id="' + row.rowId + '"]');
    var prevTr = tr.prev();
    tr.detach().insertBefore(prevTr);
  };

  /**
   * Removes row if possible.
   * In case of last row, action is ignored.
   * Operates both data object and DOM.
   * @param  {object} row Row object
   * @return {void}
   */
  Rubric.prototype.removeRow = function (row) {
    if (this.getRows().length === 1) {
      return;
    }

    if (confirm(H5PEditor.t('H5PEditor.Rubric', 'deleteRowConfirm', {}))) {
      var index = this.findRowIndex(row);
      this.getRows().splice(index, 1);
      this.$container.find('table.h5p-rubric > tbody tr.grid-row[data-id="' + row.rowId + '"]').remove();
    }
  };

  /**
   * Moves row down if possible.
   * If case of last object, ignores the action.
   * Operates both data object and DOM.
   * @param  {object} row Row object
   * @return {void}
   */
  Rubric.prototype.moveRowDown = function (row) {
    var index = this.findRowIndex(row);

    if (index === this.getRows().length - 1) {
      return;
    }

    this.getRows().splice(index, 1);
    this.getRows().splice(index + 1, 0, row);
    var tr = this.$container.find('table.h5p-rubric > tbody tr.grid-row[data-id="' + row.rowId + '"]');
    var nextTr = tr.next();
    tr.detach().insertAfter(nextTr);
  };

  /**
   * Builds the DOM objects and appends to the $wrapper
   * Also deals with setup of listeners and event handlers
   * @param  {object} $wrapper DOM node of container element
   * @return {void}
   */
  Rubric.prototype.appendTo = function ($wrapper) {
    var self = this;

    self.$container = $('<div>', {
      'class': 'field field-name-' + self.field.name + ' h5p-grid-rubric group'
    });
    self.$container.appendTo($wrapper);

    self.$responsiveGridContainer = $('<div>', {
      'class': 'h5p-rubric-editor-responsive'
    }).appendTo(self.$container);

    this.createGrid();
    this.createButtons();
  };

  /**
   * Runs before page is saved, makes sure the values are stored.
   * Does not really do any validation.
   * @return {boolean} Always returns true
   */
  Rubric.prototype.validate = function () {
    var data = {
      rows: [],
      columns: []
    };

    this.$container.find('table.h5p-rubric > tbody tr.grid-row').each(function (index, element) {
      var rowData = {
        rowId: $(element).data('id'),
        rowText: $(element).find('input[type="text"]').val(),
        columns: []
      };

      $(element).find('td.grid-row-column').each(function (index, element) {
        rowData.columns.push({
          columnId: $(element).data('id'),
          text: $(element).find('textarea').val()
        });
      });

      data.rows.push(rowData);
    });

    this.$container.find('table.h5p-rubric > thead > tr > th.grid-column').each(function (index, element) {
      data.columns.push({
        columnId: $(element).data('id'),
        columnText: $(element).find('input[type="text"]').val()
      });
    });

    this.setValue(this.field, data);

    return true;
  };

  /**
   * Handles element removal
   * @return {void}
   */
  Rubric.prototype.remove = function () {
    this.$container.remove();
  };

  return Rubric;
})(H5P.jQuery, H5P.JoubelUI);
