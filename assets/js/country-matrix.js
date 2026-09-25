(function () {
  'use strict';

  function initialiseCountryMatrix() {
    var table = document.querySelector('[data-country-matrix]');
    var searchInput = document.getElementById('matrix-search-input');
    var committeeFilter = document.getElementById('matrix-committee-filter');
    var resultCount = document.getElementById('matrix-result-count');
    var resultLabel = document.getElementById('matrix-result-label');

    if (!table || !searchInput || !committeeFilter || !resultCount || !resultLabel) {
      return;
    }

    var headers = Array.prototype.slice.call(table.querySelectorAll('thead th'));
    var body = table.tBodies[0];
    var rows = Array.prototype.slice.call(body.rows);
    var tableContainer = table.closest('.table-container');

    headers.slice(1).forEach(function (header, index) {
      var option = document.createElement('option');
      option.value = String(index + 1);
      option.textContent = header.textContent.trim();
      committeeFilter.appendChild(option);
    });

    rows.forEach(function (row) {
      Array.prototype.slice.call(row.cells, 1).forEach(function (cell) {
        var status = cell.textContent.trim();
        cell.dataset.status = status;

        if (!status) {
          return;
        }

        cell.classList.add('matrix-cell--allocated');

        if (/obs/i.test(status)) {
          cell.innerHTML = '<span class="matrix-status matrix-status--observer" aria-hidden="true">OBS</span><span class="sr-only">Observer allocation</span>';
        } else {
          cell.innerHTML = '<span class="matrix-status matrix-status--allocated" aria-hidden="true">&#10003;</span><span class="sr-only">Allocated</span>';
        }
      });
    });

    var emptyRow = document.createElement('tr');
    emptyRow.className = 'matrix-empty-state';
    emptyRow.hidden = true;
    emptyRow.innerHTML = '<td colspan="' + headers.length + '">No countries match those filters.</td>';
    body.appendChild(emptyRow);

    function updateColumnVisibility(selectedColumn) {
      var focusedColumn = selectedColumn === 'all' ? null : Number(selectedColumn);

      headers.forEach(function (header, index) {
        header.hidden = focusedColumn !== null && index !== 0 && index !== focusedColumn;
      });

      rows.forEach(function (row) {
        Array.prototype.forEach.call(row.cells, function (cell, index) {
          cell.hidden = focusedColumn !== null && index !== 0 && index !== focusedColumn;
        });
      });

      emptyRow.cells[0].colSpan = focusedColumn === null ? headers.length : 2;
      table.classList.toggle('matrix-table--focused', focusedColumn !== null);
    }

    function applyFilters() {
      var query = searchInput.value.trim().toLowerCase();
      var selectedColumn = committeeFilter.value;
      var focusedColumn = selectedColumn === 'all' ? null : Number(selectedColumn);
      var visibleCount = 0;

      rows.forEach(function (row) {
        var countryName = row.cells[0].textContent.trim().toLowerCase();
        var matchesSearch = !query || countryName.indexOf(query) !== -1;
        var matchesCommittee = focusedColumn === null || Boolean(row.cells[focusedColumn].dataset.status);
        var isVisible = matchesSearch && matchesCommittee;

        row.hidden = !isVisible;
        if (isVisible) {
          visibleCount += 1;
        }
      });

      emptyRow.hidden = visibleCount !== 0;
      resultCount.textContent = String(visibleCount);
      resultLabel.textContent = visibleCount === 1 ? 'country shown' : 'countries shown';
    }

    searchInput.addEventListener('input', applyFilters);
    committeeFilter.addEventListener('change', function () {
      updateColumnVisibility(committeeFilter.value);
      applyFilters();

      if (tableContainer) {
        tableContainer.scrollLeft = 0;
      }
    });

    updateColumnVisibility('all');
    applyFilters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialiseCountryMatrix);
  } else {
    initialiseCountryMatrix();
  }
}());
