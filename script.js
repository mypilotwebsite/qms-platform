/**
 * AUTO-REFRESH LOGIC
 * Periodically checks if the server data has changed
 */
function initAutoRefresh(endpoint, currentVal) {
    let internalState = currentVal;
    setInterval(() => {
        fetch(`${endpoint}?check_update=1`)
            .then(res => res.text())
            .then(newState => {
                if (internalState && internalState !== newState) {
                    location.reload();
                }
                internalState = newState;
            });
    }, 3000);
}

/**
 * SHARED UTILITIES
 */
function toggleModal(show) {
    document.getElementById('modalOverlay').style.display = show ? 'block' : 'none';
    document.getElementById('passModal').style.display = show ? 'block' : 'none';
    if (show) document.getElementById('modalPass').focus();
}

/**
 * CSV EXPORT
 */
function downloadCSV() {
    let csv = [];
    const getVal = (id) => document.getElementById(id)?.value || '';
    
    csv.push(`Subject:,"${getVal('csv_subj')}"`);
    csv.push(`Section:,"${getVal('csv_sect')}"`);
    csv.push(`Date:,"${getVal('csv_date')}"`);
    csv.push("");
    csv.push("Queue No,PC No,Student Name,Grade");

    document.querySelectorAll("#mainTable tbody tr").forEach(row => {
        let cols = row.querySelectorAll("td");
        if (cols.length > 1) {
            csv.push(`${cols[0].innerText},${cols[1].innerText.replace('#','')},"${cols[2].innerText}",${cols[3].innerText}`);
        }
    });

    let csvContent = "data:text/csv;charset=utf-8," + csv.join("\n");
    let link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `Report_${getVal('csv_sect')}.csv`);
    link.click();
}

/**
 * FORM HANDLING
 */
function handleAjaxForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.onsubmit = function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        formData.append('ajax', '1');

        fetch(window.location.href, { method: 'POST', body: formData })
            .then(res => res.text())
            .then(data => {
                if (data.includes("SUCCESS") || data === "") {
                    location.reload();
                } else {
                    alert(data);
                }
            });
    };
}